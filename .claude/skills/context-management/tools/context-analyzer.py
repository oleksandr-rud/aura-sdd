#!/usr/bin/env python3
"""
Context Analyzer for Advanced Context Management

This script provides intelligent context analysis capabilities including
state assessment, progression analysis, decision mining, and quality validation
for sophisticated context management operations.
"""

import re
import json
import sys
import os
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from pathlib import Path

@dataclass
class ContextMetrics:
    """Data class for context analysis metrics."""
    completeness_score: float
    accuracy_score: float
    accessibility_score: float
    clarity_score: float
    overall_quality_score: float
    critical_decisions_count: int
    active_blockers_count: int
    artifact_accessibility_rate: float
    progression_velocity: float
    risk_exposure_score: float

@dataclass
class DecisionRecord:
    """Data class for decision tracking."""
    decision_id: str
    timestamp: str
    decision_type: str
    rationale: str
    outcome: str
    impact_level: str
    stakeholders: List[str]

@dataclass
class BlockerRecord:
    """Data class for blocker tracking."""
    blocker_id: str
    description: str
    severity: str
    owner: str
    mitigation_strategy: str
    estimated_resolution: str
    dependencies: List[str]

class ContextAnalyzer:
    def __init__(self):
        self.task_content = ""
        self.lifecycle_log = []
        self.artifacts = []
        self.metrics = ContextMetrics(0.0, 0.0, 0.0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0)
        self.decisions = []
        self.blockers = []

    def load_task_file(self, file_path: str):
        """Load and parse task file content."""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                self.task_content = file.read()
            self._parse_task_content()
            self._extract_lifecycle_log()
        except FileNotFoundError:
            print(f"Error: Task file '{file_path}' not found.")
            sys.exit(1)
        except Exception as e:
            print(f"Error loading task file: {e}")
            sys.exit(1)

    def _parse_task_content(self):
        """Parse task content into structured components."""
        # Extract major sections
        sections = re.split(r'^## ', self.task_content, flags=re.MULTILINE)

        # Extract lifecycle log entries
        lifecycle_pattern = r'\[TRANSITION\|([^\]]+)\].*?=== END ([^\s]+) ==='
        matches = re.findall(lifecycle_pattern, self.task_content, re.DOTALL)

        for match in matches:
            transition_type, artifact_type = match
            self.lifecycle_log.append({
                'transition_type': transition_type,
                'artifact_type': artifact_type,
                'content': self._extract_log_entry(transition_type, artifact_type)
            })

    def _extract_log_entry(self, transition_type: str, artifact_type: str) -> Dict:
        """Extract detailed information from a log entry."""
        pattern = rf'\[TRANSITION\|{re.escape(transition_type)}\].*?=== {re.escape(artifact_type)} ===(.*?)=== END {re.escape(artifact_type)} ==='
        match = re.search(pattern, self.task_content, re.DOTALL)

        if match:
            content = match.group(1).strip()
            return self._parse_log_content(content)
        return {}

    def _parse_log_content(self, content: str) -> Dict:
        """Parse structured content from log entry."""
        parsed = {}

        # Extract summary
        summary_match = re.search(r'summary:(.*?)(?=\n\w+:|$)', content, re.DOTALL)
        if summary_match:
            parsed['summary'] = summary_match.group(1).strip()

        # Extract inputs
        inputs_match = re.search(r'inputs:(.*?)(?=\n\w+:|$)', content, re.DOTALL)
        if inputs_match:
            parsed['inputs'] = inputs_match.group(1).strip()

        # Extract evidence
        evidence_match = re.search(r'evidence:(.*?)(?=\n\w+:|$)', content, re.DOTALL)
        if evidence_match:
            parsed['evidence'] = evidence_match.group(1).strip()

        # Extract risks
        risks_match = re.search(r'risks:\[(.*?)\](.*?)(?=\n\w+:|$)', content, re.DOTALL)
        if risks_match:
            parsed['risks'] = risks_match.group(1).strip()
            parsed['risk_details'] = risks_match.group(2).strip()

        # Extract next steps
        next_steps_match = re.search(r'next_steps:(.*?)(?=\n===|$)', content, re.DOTALL)
        if next_steps_match:
            parsed['next_steps'] = next_steps_match.group(1).strip()

        return parsed

    def _extract_lifecycle_log(self):
        """Extract and analyze lifecycle log patterns."""
        # This is a simplified version - in practice, you'd parse the actual lifecycle log section
        pass

    def analyze_completeness(self) -> float:
        """Analyze context completeness."""
        completeness_factors = []

        # Check for essential sections
        essential_sections = ['Header', 'Rolling Summary', 'Product Brief', 'Lifecycle Log']
        for section in essential_sections:
            if section in self.task_content:
                completeness_factors.append(1.0)
            else:
                completeness_factors.append(0.0)

        # Check for current status information
        if re.search(r'Current Status:', self.task_content):
            completeness_factors.append(1.0)
        else:
            completeness_factors.append(0.5)

        # Check for recent activity
        if len(self.lifecycle_log) > 0:
            completeness_factors.append(1.0)
        else:
            completeness_factors.append(0.0)

        return sum(completeness_factors) / len(completeness_factors) * 100

    def analyze_accuracy(self) -> float:
        """Analyze context accuracy through cross-validation."""
        accuracy_factors = []

        # Check for consistent information
        status_patterns = re.findall(r'Status:\s*(\w+)', self.task_content)
        if len(set(status_patterns)) <= 1:  # Consistent status
            accuracy_factors.append(1.0)
        else:
            accuracy_factors.append(0.7)

        # Check for date consistency
        date_patterns = re.findall(r'\d{4}-\d{2}-\d{2}', self.task_content)
        if len(date_patterns) > 0:
            accuracy_factors.append(1.0)
        else:
            accuracy_factors.append(0.8)

        # Check for structured data consistency
        if self.lifecycle_log:
            accuracy_factors.append(1.0)
        else:
            accuracy_factors.append(0.6)

        return sum(accuracy_factors) / len(accuracy_factors) * 100

    def analyze_accessibility(self) -> float:
        """Analyze artifact accessibility."""
        # Extract referenced files and check accessibility
        file_references = re.findall(r'ref=([^|\s\]]+)', self.task_content)

        if not file_references:
            return 100.0  # No external references

        accessible_files = 0
        for ref in file_references:
            if os.path.exists(ref):
                accessible_files += 1
            else:
                # Try relative paths
                for base_path in ['.', 'docs', 'artifacts', 'ref']:
                    if os.path.exists(os.path.join(base_path, ref)):
                        accessible_files += 1
                        break

        return (accessible_files / len(file_references)) * 100 if file_references else 100.0

    def analyze_clarity(self) -> float:
        """Analyze context clarity and organization."""
        clarity_factors = []

        # Check for clear structure
        if re.search(r'^#{1,3}\s+', self.task_content, re.MULTILINE):
            clarity_factors.append(1.0)
        else:
            clarity_factors.append(0.5)

        # Check for summary sections
        if re.search(r'##\s*(Summary|Overview|Executive Summary)', self.task_content, re.IGNORECASE):
            clarity_factors.append(1.0)
        else:
            clarity_factors.append(0.7)

        # Check for action items
        if re.search(r'next_steps:|FOLLOW-UP:', self.task_content):
            clarity_factors.append(1.0)
        else:
            clarity_factors.append(0.6)

        # Check for clear status indicators
        if re.search(r'Status:|Current Status:', self.task_content):
            clarity_factors.append(1.0)
        else:
            clarity_factors.append(0.5)

        return sum(clarity_factors) / len(clarity_factors) * 100

    def extract_decisions(self) -> List[DecisionRecord]:
        """Extract critical decisions from context."""
        decisions = []

        # Look for decision patterns in lifecycle log
        decision_patterns = [
            r'decided to\s+([^.\n]+)',
            r'decision:\s*([^.\n]+)',
            r'chose\s+([^.\n]+)',
            r'approved\s+([^.\n]+)'
        ]

        for entry in self.lifecycle_log:
            content = str(entry.get('content', ''))
            for pattern in decision_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                for match in matches:
                    decision = DecisionRecord(
                        decision_id=f"DEC-{len(decisions)+1:03d}",
                        timestamp=datetime.now().isoformat(),
                        decision_type="strategic",
                        rationale=match.strip(),
                        outcome="pending",
                        impact_level="medium",
                        stakeholders=[]
                    )
                    decisions.append(decision)

        return decisions

    def extract_blockers(self) -> List[BlockerRecord]:
        """Extract active blockers from context."""
        blockers = []

        # Look for blocker patterns
        blocker_patterns = [
            r'BLOCKED\([^)]+\)',
            r'blocked by\s+([^.\n]+)',
            r'blocker:\s*([^.\n]+)',
            r'waiting for\s+([^.\n]+)'
        ]

        content = self.task_content
        for pattern in blocker_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                blocker = BlockerRecord(
                    blocker_id=f"BLK-{len(blockers)+1:03d}",
                    description=match.strip(),
                    severity="medium",
                    owner="unassigned",
                    mitigation_strategy="pending",
                    estimated_resolution="unknown",
                    dependencies=[]
                )
                blockers.append(blocker)

        return blockers

    def calculate_progression_velocity(self) -> float:
        """Calculate workflow progression velocity."""
        if not self.lifecycle_log:
            return 0.0

        # Count transitions in different time periods
        recent_transitions = 0
        older_transitions = 0

        # Simple heuristic: count transitions and estimate velocity
        total_transitions = len(self.lifecycle_log)

        if total_transitions == 0:
            return 0.0
        elif total_transitions <= 3:
            return 25.0  # Slow progression
        elif total_transitions <= 7:
            return 50.0  # Medium progression
        elif total_transitions <= 12:
            return 75.0  # Good progression
        else:
            return 100.0  # Fast progression

    def calculate_risk_exposure(self) -> float:
        """Calculate risk exposure score."""
        risk_factors = []

        # Count blockers
        blocker_count = len(self.blockers)
        if blocker_count == 0:
            risk_factors.append(0.0)
        elif blocker_count <= 2:
            risk_factors.append(25.0)
        elif blocker_count <= 5:
            risk_factors.append(50.0)
        else:
            risk_factors.append(75.0)

        # Check for risk keywords
        risk_keywords = ['risk:', 'uncertainty', 'dependency', 'blocker', 'issue']
        risk_keyword_count = sum(len(re.findall(rf'\b{keyword}\b', self.task_content, re.IGNORECASE))
                               for keyword in risk_keywords)

        if risk_keyword_count == 0:
            risk_factors.append(0.0)
        elif risk_keyword_count <= 3:
            risk_factors.append(25.0)
        elif risk_keyword_count <= 7:
            risk_factors.append(50.0)
        else:
            risk_factors.append(75.0)

        return sum(risk_factors) / len(risk_factors)

    def generate_context_analysis(self) -> Dict:
        """Generate comprehensive context analysis."""
        # Calculate all metrics
        completeness = self.analyze_completeness()
        accuracy = self.analyze_accuracy()
        accessibility = self.analyze_accessibility()
        clarity = self.analyze_clarity()

        # Extract decisions and blockers
        self.decisions = self.extract_decisions()
        self.blockers = self.extract_blockers()

        # Calculate derived metrics
        progression_velocity = self.calculate_progression_velocity()
        risk_exposure = self.calculate_risk_exposure()

        # Calculate overall quality score
        overall_quality = (completeness + accuracy + accessibility + clarity) / 4

        # Update metrics object
        self.metrics = ContextMetrics(
            completeness_score=completeness,
            accuracy_score=accuracy,
            accessibility_score=accessibility,
            clarity_score=clarity,
            overall_quality_score=overall_quality,
            critical_decisions_count=len(self.decisions),
            active_blockers_count=len(self.blockers),
            artifact_accessibility_rate=accessibility,
            progression_velocity=progression_velocity,
            risk_exposure_score=risk_exposure
        )

        return {
            'metrics': asdict(self.metrics),
            'decisions': [asdict(decision) for decision in self.decisions],
            'blockers': [asdict(blocker) for blocker in self.blockers],
            'lifecycle_log_summary': {
                'total_entries': len(self.lifecycle_log),
                'recent_activity': len(self.lifecycle_log[-5:]) if len(self.lifecycle_log) >= 5 else len(self.lifecycle_log)
            }
        }

    def generate_recommendations(self) -> List[str]:
        """Generate actionable recommendations based on analysis."""
        recommendations = []

        # Completeness recommendations
        if self.metrics.completeness_score < 80:
            recommendations.append("📝 Context completeness below 80%. Add missing sections: current status, recent progress, or updated Rolling Summary.")

        # Accessibility recommendations
        if self.metrics.accessibility_score < 100:
            recommendations.append(f"🔗 {100 - int(self.metrics.accessibility_score)}% of referenced artifacts are inaccessible. Update file references or restore missing artifacts.")

        # Clarity recommendations
        if self.metrics.clarity_score < 70:
            recommendations.append("📖 Context clarity needs improvement. Add clear summary sections, structured headers, and explicit next steps.")

        # Blocker recommendations
        if self.metrics.active_blockers_count > 0:
            recommendations.append(f"🚧 {self.metrics.active_blockers_count} active blockers identified. Assign owners and create mitigation strategies.")

        # Risk recommendations
        if self.metrics.risk_exposure_score > 50:
            recommendations.append("⚠️ High risk exposure detected. Implement risk mitigation strategies and increase monitoring frequency.")

        # Progress recommendations
        if self.metrics.progression_velocity < 30:
            recommendations.append("🐌 Low progression velocity detected. Review blockers, resource allocation, and timeline feasibility.")

        # Decision recommendations
        if self.metrics.critical_decisions_count > 5:
            recommendations.append("🎯 Multiple critical decisions recorded. Consider decision review and impact validation.")

        if not recommendations:
            recommendations.append("✅ Excellent context quality! All metrics meet or exceed targets.")

        return recommendations

    def generate_report(self) -> str:
        """Generate comprehensive context analysis report."""
        analysis = self.generate_context_analysis()
        recommendations = self.generate_recommendations()

        report = []
        report.append("# Context Analysis Report")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")

        # Executive Summary
        report.append("## Executive Summary")
        metrics = analysis['metrics']
        report.append(f"**Overall Quality Score**: {metrics['overall_quality_score']:.1f}/100")
        report.append(f"**Completeness**: {metrics['completeness_score']:.1f}%")
        report.append(f"**Accuracy**: {metrics['accuracy_score']:.1f}%")
        report.append(f"**Accessibility**: {metrics['accessibility_score']:.1f}%")
        report.append(f"**Clarity**: {metrics['clarity_score']:.1f}%")
        report.append("")

        # Critical Information
        report.append("## Critical Information")
        report.append(f"**Active Blockers**: {metrics['active_blockers_count']}")
        report.append(f"**Critical Decisions**: {metrics['critical_decisions_count']}")
        report.append(f"**Progression Velocity**: {metrics['progression_velocity']:.1f}%")
        report.append(f"**Risk Exposure**: {metrics['risk_exposure_score']:.1f}%")
        report.append("")

        # Detailed Metrics
        report.append("## Detailed Metrics")
        report.append("### Quality Assessment")
        report.append(f"- **Completeness Score**: {metrics['completeness_score']:.1f}% - {'✅ Excellent' if metrics['completeness_score'] >= 90 else '⚠️ Needs Improvement' if metrics['completeness_score'] >= 70 else '❌ Poor'}")
        report.append(f"- **Accuracy Score**: {metrics['accuracy_score']:.1f}% - {'✅ Excellent' if metrics['accuracy_score'] >= 90 else '⚠️ Needs Improvement' if metrics['accuracy_score'] >= 70 else '❌ Poor'}")
        report.append(f"- **Accessibility Score**: {metrics['accessibility_score']:.1f}% - {'✅ Excellent' if metrics['accessibility_score'] >= 95 else '⚠️ Needs Improvement' if metrics['accessibility_score'] >= 80 else '❌ Poor'}")
        report.append(f"- **Clarity Score**: {metrics['clarity_score']:.1f}% - {'✅ Excellent' if metrics['clarity_score'] >= 85 else '⚠️ Needs Improvement' if metrics['clarity_score'] >= 70 else '❌ Poor'}")
        report.append("")

        # Progress Analysis
        report.append("### Progress Analysis")
        log_summary = analysis['lifecycle_log_summary']
        report.append(f"- **Total Lifecycle Entries**: {log_summary['total_entries']}")
        report.append(f"- **Recent Activity**: {log_summary['recent_activity']} entries in last period")
        report.append(f"- **Progression Velocity**: {metrics['progression_velocity']:.1f}% - {'🚀 Fast' if metrics['progression_velocity'] >= 75 else '🐌 Slow' if metrics['progression_velocity'] <= 30 else '⚡ Normal'}")
        report.append("")

        # Risk Assessment
        report.append("### Risk Assessment")
        report.append(f"- **Risk Exposure Score**: {metrics['risk_exposure_score']:.1f}% - {'🟢 Low' if metrics['risk_exposure_score'] <= 25 else '🟡 Medium' if metrics['risk_exposure_score'] <= 50 else '🔴 High'}")
        report.append(f"- **Active Blockers**: {metrics['active_blockers_count']} - {'✅ None' if metrics['active_blockers_count'] == 0 else '⚠️ Some' if metrics['active_blockers_count'] <= 3 else '🔴 Many'}")
        report.append("")

        # Decisions
        if analysis['decisions']:
            report.append("## Critical Decisions")
            for decision in analysis['decisions'][:5]:  # Show first 5
                report.append(f"### {decision['decision_id']}")
                report.append(f"- **Type**: {decision['decision_type']}")
                report.append(f"- **Decision**: {decision['rationale']}")
                report.append(f"- **Impact**: {decision['impact_level']}")
                report.append("")

        # Blockers
        if analysis['blockers']:
            report.append("## Active Blockers")
            for blocker in analysis['blockers'][:5]:  # Show first 5
                report.append(f"### {blocker['blocker_id']}")
                report.append(f"- **Description**: {blocker['description']}")
                report.append(f"- **Severity**: {blocker['severity']}")
                report.append(f"- **Owner**: {blocker['owner']}")
                report.append("")

        # Recommendations
        report.append("## Recommendations")
        for recommendation in recommendations:
            report.append(f"- {recommendation}")
        report.append("")

        # Quality Targets
        report.append("## Quality Targets")
        report.append("- **Completeness**: ≥90% for comprehensive context")
        report.append("- **Accuracy**: ≥90% for reliable information")
        report.append("- **Accessibility**: 100% for full artifact availability")
        report.append("- **Clarity**: ≥85% for effective communication")
        report.append("- **Risk Exposure**: ≤25% for manageable risk level")
        report.append("")

        return "\n".join(report)

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Context Analyzer for Advanced Context Management")
    parser.add_argument("task_file", help="Path to task file for analysis")
    parser.add_argument("--output", help="Output file for analysis report")
    parser.add_argument("--format", choices=["text", "json"], default="text", help="Output format")
    parser.add_argument("--verbose", action="store_true", help="Include detailed analysis")

    args = parser.parse_args()

    analyzer = ContextAnalyzer()
    analyzer.load_task_file(args.task_file)

    if args.format == "json":
        analysis = analyzer.generate_context_analysis()
        recommendations = analyzer.generate_recommendations()

        report_data = {
            "analysis": analysis,
            "recommendations": recommendations,
            "generated_at": datetime.now().isoformat()
        }
        report = json.dumps(report_data, indent=2)
    else:
        report = analyzer.generate_report()

    # Output report
    if args.output:
        with open(args.output, 'w') as file:
            file.write(report)
        print(f"Context analysis report saved to {args.output}")
    else:
        print(report)

if __name__ == "__main__":
    main()