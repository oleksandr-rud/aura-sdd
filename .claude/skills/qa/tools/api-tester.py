#!/usr/bin/env python3
"""
API Testing Tool for QA Skill

This script provides comprehensive API testing capabilities including RESTful API
testing, GraphQL testing, contract validation, and performance testing.
"""

import asyncio
import json
import sys
import time
import requests
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from pathlib import Path
import aiohttp
import jwt
from datetime import datetime, timedelta

@dataclass
class APITestResult:
    """Data class for API test results."""
    test_name: str
    method: str
    url: str
    status_code: int
    expected_status: int
    status: str  # passed, failed, skipped
    duration: float
    response_time: float
    request_size: int
    response_size: int
    error_message: Optional[str]
    validation_results: Dict[str, Any]

@dataclass
class ContractTestResult:
    """Data class for contract test results."""
    test_name: str
    spec_type: str  # openapi, graphql
    compliance_score: float
    violations: List[Dict[str, Any]]
    passed_validations: int
    total_validations: int
    status: str
    duration: float

class APITester:
    def __init__(self):
        self.test_results = []
        self.contract_results = []
        self.base_url = ""
        self.headers = {}
        self.auth_token = None
        self.timeout = 30

        # Directory setup
        self.reports_dir = Path("reports")
        self.test_data_dir = Path("test_data")
        self.specs_dir = Path("specs")

        self.reports_dir.mkdir(exist_ok=True)
        self.test_data_dir.mkdir(exist_ok=True)
        self.specs_dir.mkdir(exist_ok=True)

    def set_base_url(self, url: str):
        """Set base URL for API testing."""
        self.base_url = url.rstrip('/')
        print(f"🔗 Base URL set to: {self.base_url}")

    def set_auth_token(self, token: str, auth_type: str = "Bearer"):
        """Set authentication token."""
        self.auth_token = token
        self.headers["Authorization"] = f"{auth_type} {token}"
        print(f"🔐 Authentication token set ({auth_type})")

    def set_headers(self, headers: Dict[str, str]):
        """Set default headers for requests."""
        self.headers.update(headers)
        print(f"📋 Headers set: {list(headers.keys())}")

    async def make_request(self, method: str, endpoint: str,
                          data: Optional[Dict] = None,
                          params: Optional[Dict] = None,
                          expected_status: int = 200,
                          test_name: str = None) -> APITestResult:
        """Make HTTP request and return test result."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        method = method.upper()

        if test_name is None:
            test_name = f"{method}_{endpoint.replace('/', '_')}"

        print(f"📡 {method} {url}")

        start_time = time.time()
        status = "passed"
        error_message = None
        validation_results = {}
        status_code = None
        response_data = None

        try:
            async with aiohttp.ClientSession(headers=self.headers, timeout=self.timeout) as session:
                # Start timing
                request_start = time.time()

                if method == "GET":
                    async with session.get(url, params=params) as response:
                        status_code = response.status
                        response_data = await response.json()
                        response_text = await response.text()

                elif method == "POST":
                    async with session.post(url, json=data, params=params) as response:
                        status_code = response.status
                        response_data = await response.json()
                        response_text = await response.text()

                elif method == "PUT":
                    async with session.put(url, json=data, params=params) as response:
                        status_code = response.status
                        response_data = await response.json()
                        response_text = await response.text()

                elif method == "DELETE":
                    async with session.delete(url, params=params) as response:
                        status_code = response.status
                        response_text = await response.text()
                        try:
                            response_data = await response.json()
                        except:
                            response_data = {"message": response_text}

                else:
                    raise ValueError(f"Unsupported HTTP method: {method}")

                response_time = time.time() - request_start

                # Validate status code
                if status_code != expected_status:
                    status = "failed"
                    error_message = f"Expected status {expected_status}, got {status_code}"

                # Additional validations
                validation_results = await self.validate_response(
                    response_data, method, endpoint
                )

                print(f"  {status.upper()} - Status: {status_code}, Time: {response_time:.3f}s")

        except asyncio.TimeoutError:
            status = "failed"
            error_message = "Request timeout"
            response_time = self.timeout

        except Exception as e:
            status = "failed"
            error_message = str(e)
            response_time = time.time() - start_time

        duration = time.time() - start_time

        result = APITestResult(
            test_name=test_name,
            method=method,
            url=url,
            status_code=status_code or 0,
            expected_status=expected_status,
            status=status,
            duration=duration,
            response_time=response_time or 0,
            request_size=len(json.dumps(data).encode() if data else b''),
            response_size=len(json.dumps(response_data).encode() if response_data else b''),
            error_message=error_message,
            validation_results=validation_results
        )

        self.test_results.append(result)
        return result

    async def validate_response(self, response_data: Any, method: str, endpoint: str) -> Dict[str, Any]:
        """Validate API response against expected patterns."""
        validations = {}

        # Basic structure validation
        if isinstance(response_data, dict):
            validations["has_data"] = True
            validations["data_keys"] = list(response_data.keys())
        elif isinstance(response_data, list):
            validations["is_list"] = True
            validations["list_length"] = len(response_data)
        else:
            validations["data_type"] = type(response_data).__name__

        # Method-specific validations
        if method == "GET" and endpoint.startswith("/api/users"):
            if isinstance(response_data, list):
                validations["user_list_format"] = True
                if response_data:
                    user = response_data[0]
                    required_fields = ["id", "name", "email"]
                    missing_fields = [f for f in required_fields if f not in user]
                    if missing_fields:
                        validations["missing_user_fields"] = missing_fields

        elif method == "POST" and endpoint.startswith("/api/users"):
            if isinstance(response_data, dict):
                validations["user_creation_format"] = True
                required_fields = ["id", "name", "email", "created_at"]
                missing_fields = [f for f in required_fields if f not in response_data]
                if missing_fields:
                    validations["missing_creation_fields"] = missing_fields

        return validations

    async def run_api_test_suite(self, test_config: Dict[str, Any]) -> List[APITestResult]:
        """Run comprehensive API test suite."""
        print(f"🧪 Running API test suite with {len(test_config.get('tests', []))} tests")

        results = []

        for test in test_config.get("tests", []):
            result = await self.make_request(**test)
            results.append(result)

        return results

    async def test_openapi_contract(self, spec_file: str) -> ContractTestResult:
        """Test API against OpenAPI specification."""
        print(f"📋 Testing OpenAPI contract compliance: {spec_file}")

        start_time = time.time()
        violations = []
        passed_validations = 0
        total_validations = 0

        try:
            # Load OpenAPI specification
            spec_path = self.specs_dir / spec_file
            if not spec_path.exists():
                spec_path = Path(spec_file)

            with open(spec_path, 'r') as f:
                spec = json.load(f)

            # Validate OpenAPI structure
            openapi_version = spec.get("openapi")
            if not openapi_version:
                violations.append({
                    "type": "missing_version",
                    "message": "OpenAPI version not specified"
                })
            else:
                passed_validations += 1
            total_validations += 1

            # Validate paths
            paths = spec.get("paths", {})
            if not paths:
                violations.append({
                    "type": "missing_paths",
                    "message": "No paths defined in specification"
                })
            else:
                passed_validations += 1
                total_validations += 1

                # Validate each path
                for path, path_item in paths.items():
                    for method, operation in path_item.items():
                        if method.upper() in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                            # Validate operation has responses
                            responses = operation.get("responses", {})
                            if not responses:
                                violations.append({
                                    "type": "missing_responses",
                                    "message": f"No responses defined for {method.upper()} {path}",
                                    "path": path,
                                    "method": method
                                })
                            else:
                                passed_validations += 1
                            total_validations += 1

                            # Validate operation has operationId
                            operation_id = operation.get("operationId")
                            if not operation_id:
                                violations.append({
                                    "type": "missing_operation_id",
                                    "message": f"No operationId defined for {method.upper()} {path}",
                                    "path": path,
                                    "method": method
                                })
                            else:
                                passed_validations += 1
                            total_validations += 1

            # Test actual API against specification
            for path, path_item in paths.items():
                for method, operation in path_item.items():
                    if method.upper() in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                        try:
                            result = await self.make_request(method, path, test_name=f"contract_{method}_{path.replace('/', '_')}")

                            if result.status_code not in operation.get("responses", {}):
                                violations.append({
                                    "type": "response_code_mismatch",
                                    "message": f"Response code {result.status_code} not defined in specification",
                                    "path": path,
                                    "method": method,
                                    "actual_status": result.status_code
                                })
                            else:
                                passed_validations += 1
                            total_validations += 1

                        except Exception as e:
                            violations.append({
                                "type": "request_failed",
                                "message": f"Request failed: {str(e)}",
                                "path": path,
                                "method": method
                            })

        except Exception as e:
            violations.append({
                "type": "specification_error",
                "message": f"Error processing specification: {str(e)}"
            })

        duration = time.time() - start_time

        compliance_score = (passed_validations / total_validations) * 100 if total_validations > 0 else 0
        status = "passed" if compliance_score >= 90 else "failed"

        result = ContractTestResult(
            test_name=f"openapi_contract_{spec_file}",
            spec_type="openapi",
            compliance_score=compliance_score,
            violations=violations,
            passed_validations=passed_validations,
            total_validations=total_validations,
            status=status,
            duration=duration
        )

        self.contract_results.append(result)
        return result

    async def test_graphql_contract(self, schema_file: str) -> ContractTestResult:
        """Test GraphQL API against schema specification."""
        print(f"📋 Testing GraphQL contract compliance: {schema_file}")

        start_time = time.time()
        violations = []
        passed_validations = 0
        total_validations = 0

        try:
            # Load GraphQL schema
            schema_path = self.specs_dir / schema_file
            if not schema_path.exists():
                schema_path = Path(schema_file)

            with open(schema_path, 'r') as f:
                schema = f.read()

            # Test GraphQL queries
            test_queries = [
                {
                    "name": "introspection_query",
                    "query": """
                    query IntrospectionQuery {
                        __schema {
                            types {
                                name
                                kind
                            }
                        }
                    }
                    """
                },
                {
                    "name": "user_query",
                    "query": """
                    query GetUser($id: ID!) {
                        user(id: $id) {
                            id
                            name
                            email
                        }
                    }
                    """,
                    "variables": {"id": "1"}
                }
            ]

            for test_query in test_queries:
                try:
                    result = await self.make_graphql_request(
                        test_query["query"],
                        test_query.get("variables"),
                        test_name=f"graphql_{test_query['name']}"
                    )

                    if result.status == "passed":
                        passed_validations += 1
                    else:
                        violations.append({
                            "type": "query_failed",
                            "message": f"GraphQL query {test_query['name']} failed: {result.error_message}",
                            "query": test_query["name"]
                        })

                    total_validations += 1

                except Exception as e:
                    violations.append({
                        "type": "query_error",
                        "message": f"Error executing GraphQL query {test_query['name']}: {str(e)}",
                        "query": test_query["name"]
                    })
                    total_validations += 1

        except Exception as e:
            violations.append({
                "type": "schema_error",
                "message": f"Error processing GraphQL schema: {str(e)}"
            })

        duration = time.time() - start_time

        compliance_score = (passed_validations / total_validations) * 100 if total_validations > 0 else 0
        status = "passed" if compliance_score >= 90 else "failed"

        result = ContractTestResult(
            test_name=f"graphql_contract_{schema_file}",
            spec_type="graphql",
            compliance_score=compliance_score,
            violations=violations,
            passed_validations=passed_validations,
            total_validations=total_validations,
            status=status,
            duration=duration
        )

        self.contract_results.append(result)
        return result

    async def make_graphql_request(self, query: str, variables: Optional[Dict] = None, test_name: str = None) -> APITestResult:
        """Make GraphQL request."""
        url = f"{self.base_url}/graphql"

        if test_name is None:
            test_name = "graphql_query"

        print(f"📡 GraphQL POST {url}")

        start_time = time.time()
        status = "passed"
        error_message = None
        validation_results = {}
        status_code = None
        response_data = None

        try:
            request_data = {
                "query": query,
                "variables": variables or {}
            }

            async with aiohttp.ClientSession(headers=self.headers, timeout=self.timeout) as session:
                request_start = time.time()

                async with session.post(url, json=request_data) as response:
                    status_code = response.status
                    response_data = await response.json()

                response_time = time.time() - request_start

                # Validate GraphQL response structure
                if "errors" in response_data:
                    status = "failed"
                    error_message = f"GraphQL errors: {response_data['errors']}"
                    validation_results["graphql_errors"] = response_data["errors"]

                if "data" not in response_data:
                    status = "failed"
                    error_message = "No data field in GraphQL response"
                    validation_results["missing_data"] = True

                print(f"  {status.upper()} - Status: {status_code}, Time: {response_time:.3f}s")

        except Exception as e:
            status = "failed"
            error_message = str(e)
            response_time = time.time() - start_time

        duration = time.time() - start_time

        result = APITestResult(
            test_name=test_name,
            method="GRAPHQL",
            url=url,
            status_code=status_code or 0,
            expected_status=200,
            status=status,
            duration=duration,
            response_time=response_time or 0,
            request_size=len(json.dumps(request_data).encode()),
            response_size=len(json.dumps(response_data).encode() if response_data else b''),
            error_message=error_message,
            validation_results=validation_results
        )

        self.test_results.append(result)
        return result

    async def run_load_test(self, endpoint: str, concurrent_users: int, duration: int) -> Dict[str, Any]:
        """Run load test on API endpoint."""
        print(f"🚀 Running load test: {concurrent_users} concurrent users for {duration}s")

        start_time = time.time()
        tasks = []
        results = []

        async def make_request_batch():
            """Make batch of requests."""
            batch_results = []
            for i in range(concurrent_users):
                result = await self.make_request("GET", endpoint, test_name=f"load_test_{i}")
                batch_results.append(result)
            return batch_results

        # Run requests for specified duration
        end_time = start_time + duration
        while time.time() < end_time:
            batch_tasks = []
            for _ in range(min(5, concurrent_users)):  # 5 concurrent batches
                batch_tasks.append(make_request_batch())

            batch_results = await asyncio.gather(*batch_tasks)
            results.extend([item for batch in batch_results for item in batch])

            await asyncio.sleep(1)  # Pause between batches

        total_time = time.time() - start_time
        total_requests = len(results)
        successful_requests = len([r for r in results if r.status == "passed"])
        failed_requests = total_requests - successful_requests

        # Calculate metrics
        avg_response_time = sum(r.response_time for r in results) / total_requests if total_requests > 0 else 0
        requests_per_second = total_requests / total_time if total_time > 0 else 0

        metrics = {
            "total_requests": total_requests,
            "successful_requests": successful_requests,
            "failed_requests": failed_requests,
            "success_rate": (successful_requests / total_requests) * 100 if total_requests > 0 else 0,
            "duration": total_time,
            "requests_per_second": requests_per_second,
            "avg_response_time": avg_response_time,
            "concurrent_users": concurrent_users
        }

        print(f"📊 Load test results:")
        print(f"  Total requests: {total_requests}")
        print(f"  Success rate: {metrics['success_rate']:.1f}%")
        print(f"  Requests/sec: {metrics['requests_per_second']:.1f}")
        print(f"  Avg response time: {metrics['avg_response_time']:.3f}s")

        return metrics

    def generate_api_test_report(self, api_results: List[APITestResult],
                                contract_results: List[ContractTestResult] = None) -> str:
        """Generate comprehensive API test report."""
        report = []
        report.append("# API Test Report")
        report.append(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")

        # API Tests Summary
        if api_results:
            total_tests = len(api_results)
            passed_tests = len([r for r in api_results if r.status == "passed"])
            failed_tests = len([r for r in api_results if r.status == "failed"])
            total_duration = sum(r.duration for r in api_results)

            report.append("## API Tests Summary")
            report.append(f"**Total Tests**: {total_tests}")
            report.append(f"**Passed**: {passed_tests}")
            report.append(f"**Failed**: {failed_tests}")
            report.append(f"**Success Rate**: {(passed_tests/total_tests)*100:.1f}%")
            report.append(f"**Total Duration**: {total_duration:.2f}s")
            report.append("")

            # Method-wise breakdown
            method_stats = {}
            for result in api_results:
                method = result.method
                if method not in method_stats:
                    method_stats[method] = {"passed": 0, "failed": 0, "total_time": 0}

                method_stats[method]["passed"] += 1 if result.status == "passed" else 0
                method_stats[method]["failed"] += 1 if result.status == "failed" else 0
                method_stats[method]["total_time"] += result.duration

            report.append("### Method-wise Results")
            for method, stats in method_stats.items():
                total = stats["passed"] + stats["failed"]
                success_rate = (stats["passed"] / total) * 100 if total > 0 else 0
                avg_time = stats["total_time"] / total if total > 0 else 0

                report.append(f"#### {method}")
                report.append(f"- **Tests**: {total}")
                report.append(f"- **Passed**: {stats['passed']}")
                report.append(f"- **Failed**: {stats['failed']}")
                report.append(f"- **Success Rate**: {success_rate:.1f}%")
                report.append(f"- **Avg Duration**: {avg_time:.3f}s")
                report.append("")

            # Failed Tests Details
            failed_results = [r for r in api_results if r.status == "failed"]
            if failed_results:
                report.append("### Failed Tests Details")
                for result in failed_results:
                    report.append(f"#### {result.test_name}")
                    report.append(f"**URL**: {result.url}")
                    report.append(f"**Method**: {result.method}")
                    report.append(f"**Expected Status**: {result.expected_status}")
                    report.append(f"**Actual Status**: {result.status_code}")
                    report.append(f"**Error**: {result.error_message}")
                    report.append("")

        # Contract Tests Summary
        if contract_results:
            report.append("## Contract Tests Summary")

            for result in contract_results:
                report.append(f"### {result.test_name}")
                report.append(f"**Spec Type**: {result.spec_type}")
                report.append(f"**Compliance Score**: {result.compliance_score:.1f}%")
                report.append(f"**Status**: {result.status}")
                report.append(f"**Duration**: {result.duration:.2f}s")
                report.append(f"**Validations**: {result.passed_validations}/{result.total_validations}")

                if result.violations:
                    report.append("**Violations**:")
                    for violation in result.violations:
                        report.append(f"- {violation['type']}: {violation['message']}")

                report.append("")

        # Performance Summary
        if api_results:
            avg_response_time = sum(r.response_time for r in api_results) / len(api_results)
            max_response_time = max(r.response_time for r in api_results)
            min_response_time = min(r.response_time for r in api_results)

            report.append("## Performance Summary")
            report.append(f"- **Average Response Time**: {avg_response_time:.3f}s")
            report.append(f"- **Max Response Time**: {max_response_time:.3f}s")
            report.append(f"- **Min Response Time**: {min_response_time:.3f}s")
            report.append("")

        return "\n".join(report)

    def save_api_test_report(self, report: str, filename: str = None):
        """Save API test report to file."""
        if filename is None:
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            filename = f"api_test_report_{timestamp}.md"

        report_path = self.reports_dir / filename
        with open(report_path, 'w') as file:
            file.write(report)

        print(f"📄 API test report saved to: {report_path}")
        return report_path

def main():
    import argparse

    parser = argparse.ArgumentParser(description="API Testing Tool for QA Skill")
    parser.add_argument("--base-url", required=True, help="Base URL for API testing")
    parser.add_argument("--token", help="Authentication token")
    parser.add_argument("--openapi-spec", help="OpenAPI specification file for contract testing")
    parser.add_argument("--graphql-schema", help="GraphQL schema file for contract testing")
    parser.add_argument("--load-test", action="store_true", help="Run load test")
    parser.add_argument("--load-concurrent", type=int, default=10, help="Concurrent users for load test")
    parser.add_argument("--load-duration", type=int, default=60, help="Duration for load test (seconds)")
    parser.add_argument("--report", help="Output file for test report")
    parser.add_argument("--test-config", help="JSON file with test configuration")

    args = parser.parse_args()

    async def main_async():
        tester = APITester()
        tester.set_base_url(args.base_url)

        if args.token:
            tester.set_auth_token(args.token)

        api_results = []
        contract_results = []

        # Run API tests from config file
        if args.test_config:
            with open(args.test_config, 'r') as f:
                test_config = json.load(f)

            api_results = await tester.run_api_test_suite(test_config)

        # Run OpenAPI contract testing
        if args.openapi_spec:
            result = await tester.test_openapi_contract(args.openapi_spec)
            contract_results.append(result)

        # Run GraphQL contract testing
        if args.graphql_schema:
            result = await tester.test_graphql_contract(args.graphql_schema)
            contract_results.append(result)

        # Run load testing
        if args.load_test:
            load_metrics = await tester.run_load_test("/api/users", args.load_concurrent, args.load_duration)
            print(f"\n📊 Load Test Metrics: {json.dumps(load_metrics, indent=2)}")

        # Generate and save report
        report = tester.generate_api_test_report(api_results, contract_results)
        tester.save_api_test_report(report, args.report)

        # Print summary
        if api_results:
            passed = len([r for r in api_results if r.status == "passed"])
            total = len(api_results)
            print(f"\n📊 API Tests: {passed}/{total} passed ({(passed/total)*100:.1f}%)")

        if contract_results:
            for result in contract_results:
                status_emoji = "✅" if result.status == "passed" else "❌"
                print(f"{status_emoji} Contract Test ({result.spec_type}): {result.compliance_score:.1f}% compliance")

    asyncio.run(main_async())

if __name__ == "__main__":
    main()