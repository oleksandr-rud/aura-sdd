# API Testing with Contract Validation Example

## Scenario

A QA engineer needs to test a newly built RESTful API with comprehensive contract validation using OpenAPI specification. The API is for an e-commerce platform with user management, product catalog, and order processing endpoints.

## Execution

```bash
exec story=API-QA-001 skill=quality-assurance operation_type=api_test \
  spec_type=openapi spec_file=specs/ecommerce-api.yaml \
  contract_validation=true performance_testing=true \
  load_test_concurrent=50 authentication_required=true
```

## Expected Output

```
[TRANSITION|quality-assurance] by qa
MODE: strict
FROM_STATE: API_READY
TO_STATE: API_VALIDATED
WHY:
- API implementation complete requiring comprehensive validation
- OpenAPI specification compliance must be verified
- Performance testing required for production readiness
- Load testing needed to validate scalability requirements
OUTPUT:
=== Quality Assurance ===
summary: Comprehensive API testing completed with 95% contract compliance, 98.2% success rate, and 1,250 requests/sec throughput performance.
inputs: operation_type=api_test spec_type=openapi spec_file=ecommerce-api.yaml contract_validation=true
evidence: api_validation|result=passed|ref=reports/api_test_report_20251027_143022.md
risks: [ ]High load scenarios may impact response times|owner=qa|mitigation=optimize_database_queries
next_steps: Deploy to staging environment and conduct integration testing with web application.
=== END Quality Assurance ===
FOLLOW-UP:
- Integration testing with web application - owner=qa - due=2025-10-28
- Security penetration testing - owner=security-lead - due=2025-10-29
```

## API Testing Implementation

### **Phase 1: Test Environment Setup**

#### **Configuration and Authentication**
```python
# API Tester Configuration
base_url = "https://api.ecommerce.example.com/v1"
auth_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
headers = {
    "Content-Type": "application/json",
    "User-Agent": "ECommerce-API-Tester/1.0"
}
```

#### **Test Data Preparation**
```python
# Test Data Sets
test_users = [
    {"email": "test@example.com", "password": "SecurePass123!"},
    {"email": "admin@example.com", "password": "AdminPass456!"},
    {"email": "user@example.com", "password": "UserPass789!"}
]

test_products = [
    {"name": "Laptop Pro", "price": 999.99, "category": "electronics"},
    {"name": "Wireless Mouse", "price": 29.99, "category": "accessories"},
    {"name": "USB-C Cable", "price": 19.99, "category": "accessories"}
]
```

### **Phase 2: Functional API Testing**

#### **User Management API Testing**
```python
# User Registration Test
result = await api_tester.make_request(
    method="POST",
    endpoint="/api/users/register",
    data={
        "email": "newuser@example.com",
        "password": "SecurePass123!",
        "first_name": "John",
        "last_name": "Doe"
    },
    expected_status=201,
    test_name="user_registration"
)

# User Login Test
login_result = await api_tester.make_request(
    method="POST",
    endpoint="/api/users/login",
    data={
        "email": "test@example.com",
        "password": "SecurePass123!"
    },
    expected_status=200,
    test_name="user_login"
)

# User Profile Test
profile_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/users/profile",
    expected_status=200,
    test_name="user_profile"
)
```

#### **Product Catalog API Testing**
```python
# Product List Test
products_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/products",
    params={"category": "electronics", "limit": 10, "offset": 0},
    expected_status=200,
    test_name="product_list"
)

# Product Details Test
product_detail_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/products/123",
    expected_status=200,
    test_name="product_detail"
)

# Product Search Test
search_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/products/search",
    params={"q": "laptop", "category": "electronics"},
    expected_status=200,
    test_name="product_search"
)
```

#### **Order Processing API Testing**
```python
# Create Order Test
order_result = await api_tester.make_request(
    method="POST",
    endpoint="/api/orders",
    data={
        "user_id": "user123",
        "items": [
            {"product_id": "prod123", "quantity": 2},
            {"product_id": "prod456", "quantity": 1}
        ],
        "shipping_address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip": "12345"
        }
    },
    expected_status=201,
    test_name="create_order"
)

# Order Status Test
order_status_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/orders/order123/status",
    expected_status=200,
    test_name="order_status"
)
```

### **Phase 3: Contract Testing with OpenAPI**

#### **OpenAPI Specification Compliance**
```python
# Load OpenAPI Specification
spec_file = "specs/ecommerce-api.yaml"
contract_result = await api_tester.test_openapi_contract(spec_file)

# Contract Test Results
contract_violations = contract_result.violations
compliance_score = contract_result.compliance_score
```

#### **Contract Validation Results**
```
=== OpenAPI Contract Testing Results ===
Specification: ecommerce-api.yaml
Compliance Score: 95.0%
Status: PASSED
Duration: 12.45s

Validations:
✅ OpenAPI version specified (3.0.2)
✅ Paths defined (12 endpoints)
✅ Response codes defined for all operations
✅ Operation IDs defined for all operations
✅ Schema validation for all responses

Violations:
⚠️ Missing example in POST /api/users/register response
⚠️ Missing deprecated field documentation in GET /api/products
⚠️ Missing security scheme for GET /api/orders/{id}
```

### **Phase 4: Performance Testing**

#### **Load Testing Results**
```python
# Load Test Configuration
concurrent_users = 50
test_duration = 120  # seconds

# Execute Load Test
load_metrics = await api_tester.run_load_test(
    endpoint="/api/products",
    concurrent_users=concurrent_users,
    duration=test_duration
)
```

#### **Performance Metrics**
```
=== Load Test Results ===
Concurrent Users: 50
Test Duration: 120 seconds

Metrics:
- Total Requests: 3,750
- Successful Requests: 3,681
- Failed Requests: 69
- Success Rate: 98.2%
- Requests/sec: 31.3
- Average Response Time: 0.245s
- Max Response Time: 1.847s
- Min Response Time: 0.089s
```

#### **Performance Analysis**
- **Throughput**: 31.3 requests/sec (exceeds 25 req/sec requirement)
- **Response Time**: Average 245ms (within 300ms target)
- **Error Rate**: 1.8% (below 5% threshold)
- **Scalability**: Successfully handles 50 concurrent users

### **Phase 5: Security Testing**

#### **Authentication and Authorization**
```python
# Invalid Credentials Test
invalid_auth_result = await api_tester.make_request(
    method="POST",
    endpoint="/api/users/login",
    data={"email": "test@example.com", "password": "wrongpassword"},
    expected_status=401,
    test_name="invalid_credentials"
)

# Missing Token Test
missing_token_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/users/profile",
    expected_status=401,
    test_name="missing_token"
)

# Invalid Token Test
api_tester.headers["Authorization"] = "Bearer invalid-token"
invalid_token_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/users/profile",
    expected_status=401,
    test_name="invalid_token"
)
```

#### **Input Validation Testing**
```python
# SQL Injection Test
sql_injection_result = await api_tester.make_request(
    method="GET",
    endpoint="/api/products",
    params={"search": "laptop'; DROP TABLE users; --"},
    expected_status=400,
    test_name="sql_injection_attempt"
)

# XSS Protection Test
xss_result = await api_tester.make_request(
    method="POST",
    endpoint="/api/users/register",
    data={"email": "<script>alert('xss')</script>@example.com", "password": "test"},
    expected_status=400,
    test_name="xss_protection"
)
```

### **Phase 6: Test Results Analysis**

#### **API Test Summary**
```
=== API Tests Summary ===
Total Tests: 24
Passed: 23
Failed: 1
Success Rate: 95.8%
Total Duration: 324.67s

Method-wise Results:
#### GET
- Tests: 12
- Passed: 12
- Failed: 0
- Success Rate: 100.0%
- Avg Duration: 0.234s

#### POST
- Tests: 8
- Passed: 7
- Failed: 1
- Success Rate: 87.5%
- Avg Duration: 0.456s

#### PUT
- Tests: 2
- Passed: 2
- Failed: 0
- Success Rate: 100.0%
- Avg Duration: 0.389s

#### DELETE
- Tests: 2
- Passed: 2
- Failed: 0
- Success Rate: 100.0%
- Avg Duration: 0.278s
```

#### **Performance Summary**
- **Average Response Time**: 0.245s
- **Max Response Time**: 1.847s
- **Min Response Time**: 0.089s
- **95th Percentile**: 0.567s
- **99th Percentile**: 1.234s

#### **Quality Gate Assessment**
```
=== Quality Gate Assessment ===

Functionality Testing: ✅ PASSED (95.8% success rate)
Contract Compliance: ✅ PASSED (95.0% compliance score)
Performance Testing: ✅ PASSED (meets all requirements)
Security Testing: ✅ PASSED (all security controls validated)

Overall Assessment: ✅ READY FOR DEPLOYMENT

Recommendations:
- Investigate POST endpoint failure rate (12.5% failure rate)
- Consider implementing response caching for product listings
- Add rate limiting to prevent potential abuse
- Implement comprehensive monitoring and alerting
```

## Context Interpretation Analysis

### **AI-Enhanced Test Planning**
The QA skill used intelligent context interpretation to:

#### **Risk-Based Test Prioritization**
1. **High Risk Areas**: User authentication, order processing, payment integration
2. **Medium Risk**: Product catalog, user management, search functionality
3. **Low Risk**: Static data endpoints, configuration endpoints

#### **Test Scenario Optimization**
- **Critical Path Testing**: User registration → Login → Product Search → Add to Cart → Checkout
- **Edge Case Identification**: Boundary conditions, invalid inputs, concurrent operations
- **Performance Bottlenecks**: Database queries, file uploads, search operations

### **Intelligent Bug Detection**
The system identified several patterns:

#### **Performance Anomalies**
```python
# Detected: Slow response times for POST /api/orders/create
# Root cause: Database transaction processing
# Recommendation: Implement database query optimization

# Detected: Increased error rate under load
# Root cause: Database connection pool exhaustion
# Recommendation: Implement connection pooling and connection reuse
```

#### **Security Vulnerability Patterns**
```python
# Detected: Potential SQL injection attempts
# Root cause: Insufficient input sanitization
# Recommendation: Implement parameterized queries and input validation

# Detected: XSS protection needed
# Root cause: HTML injection vulnerability in user input fields
# Recommendation: Implement input sanitization and output encoding
```

## Integration with AURA Constitution

### **Quality Gate Compliance**
The QA testing validated AURA constitution requirements:

#### **Architectural Compliance**
- ✅ API follows RESTful design principles
- ✅ Proper HTTP status codes and response formats
- ✅ Authentication and authorization properly implemented
- ✅ Error handling follows established patterns

#### **Code Quality Standards**
- ✅ Comprehensive test coverage (95.8% success rate)
- ✅ Contract compliance validated (95.0% compliance score)
- ✅ Performance meets requirements (31.3 req/sec throughput)
- ✅ Security controls properly implemented

#### **Documentation Standards**
- ✅ OpenAPI specification maintained and accurate
- ✅ API documentation complete and accessible
- ✅ Test cases documented and reproducible
- ✅ Test results properly archived and analyzed

## Recommendations and Next Steps

### **Immediate Actions**
1. **Fix Failed POST Endpoint**: Investigate 12.5% failure rate in POST operations
2. **Performance Optimization**: Implement caching for frequently accessed data
3. **Security Hardening**: Add rate limiting and input validation
4. **Monitoring Setup**: Implement comprehensive API monitoring and alerting

### **Medium-term Improvements**
1. **Automated Testing**: Integrate API tests into CI/CD pipeline
2. **Load Testing Expansion**: Increase concurrent users to 100 for scalability validation
3. **Security Testing**: Implement regular penetration testing schedule
4. **Documentation Updates**: Keep OpenAPI specification synchronized with implementation

### **Long-term Strategy**
1. **API Versioning**: Implement API versioning strategy for backward compatibility
2. **Analytics Integration**: Implement API usage analytics and performance monitoring
3. **Disaster Recovery**: Implement API failover and recovery procedures
4. **Compliance Auditing**: Regular security and compliance audits

This comprehensive API testing example demonstrates how the QA skill provides thorough validation across functional, performance, security, and contract compliance dimensions while using intelligent context interpretation to optimize testing strategies and identify potential issues proactively.