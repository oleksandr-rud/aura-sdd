#!/usr/bin/env python3
"""
Design Validation Tool for AURA Design Skill

This tool validates design deliverables against AURA design standards,
accessibility requirements, and best practices.
"""

import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class ValidationResult(Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARN = "WARN"

@dataclass
class ValidationIssue:
    """Represents a validation issue found in design deliverables."""
    type: str
    severity: ValidationResult
    message: str
    location: str
    suggestion: Optional[str] = None

class DesignValidator:
    """Validates design deliverables against AURA standards and best practices."""

    def __init__(self, config_path: Optional[str] = None):
        """Initialize the design validator.

        Args:
            config_path: Path to configuration file with validation rules
        """
        self.config = self._load_config(config_path)
        self.issues: List[ValidationIssue] = []

    def _load_config(self, config_path: Optional[str]) -> Dict:
        """Load configuration from file or use defaults."""
        default_config = {
            "accessibility": {
                "contrast_ratio": 4.5,
                "minimum_touch_target": 44,
                "max_line_length": 70
            },
            "performance": {
                "max_image_size_mb": 2,
                "max_animation_duration_ms": 300,
                "min_tap_target_size": 48
            },
            "design_system": {
                "require_component_spec": True,
                "require_design_tokens": True,
                "require_accessibility_annotations": True
            },
            "file_naming": {
                "pattern": r'^[a-z0-9-]+\.(png|jpg|jpeg|svg|fig|sketch)$',
                "max_length": 50
            }
        }

        if config_path and Path(config_path).exists():
            try:
                with open(config_path, 'r') as f:
                    user_config = json.load(f)
                # Merge with defaults
                return {**default_config, **user_config}
            except Exception as e:
                print(f"Warning: Could not load config file {config_path}: {e}")

        return default_config

    def validate_design_file(self, file_path: str) -> List[ValidationIssue]:
        """Validate a single design file.

        Args:
            file_path: Path to the design file

        Returns:
            List of validation issues found
        """
        self.issues = []
        path = Path(file_path)

        if not path.exists():
            self.issues.append(ValidationIssue(
                type="file_not_found",
                severity=ValidationResult.FAIL,
                message=f"File not found: {file_path}",
                location=file_path
            ))
            return self.issues

        # Validate file naming
        self._validate_file_naming(path)

        # Validate based on file type
        if path.suffix.lower() in ['.png', '.jpg', '.jpeg']:
            self._validate_image_file(path)
        elif path.suffix.lower() == '.svg':
            self._validate_svg_file(path)
        elif path.suffix.lower() in ['.fig', '.sketch']:
            self._validate_design_tool_file(path)
        elif path.suffix.lower() == '.json':
            self._validate_json_file(path)

        return self.issues

    def validate_design_system(self, design_system_path: str) -> List[ValidationIssue]:
        """Validate a design system directory.

        Args:
            design_system_path: Path to design system directory

        Returns:
            List of validation issues found
        """
        self.issues = []
        path = Path(design_system_path)

        if not path.exists():
            self.issues.append(ValidationIssue(
                type="directory_not_found",
                severity=ValidationResult.FAIL,
                message=f"Design system directory not found: {design_system_path}",
                location=design_system_path
            ))
            return self.issues

        # Check for required files
        required_files = ['tokens.json', 'components.json', 'guidelines.md']
        for file_name in required_files:
            file_path = path / file_name
            if not file_path.exists():
                self.issues.append(ValidationIssue(
                    type="missing_file",
                    severity=ValidationResult.FAIL,
                    message=f"Missing required design system file: {file_name}",
                    location=str(file_path),
                    suggestion=f"Create {file_name} with appropriate content"
                ))

        # Validate design tokens
        tokens_path = path / 'tokens.json'
        if tokens_path.exists():
            self._validate_design_tokens(tokens_path)

        # Validate components
        components_path = path / 'components.json'
        if components_path.exists():
            self._validate_components(components_path)

        return self.issues

    def validate_accessibility(self, design_spec_path: str) -> List[ValidationIssue]:
        """Validate accessibility compliance in design specifications.

        Args:
            design_spec_path: Path to design specification file

        Returns:
            List of accessibility issues found
        """
        self.issues = []
        path = Path(design_spec_path)

        if not path.exists():
            self.issues.append(ValidationIssue(
                type="file_not_found",
                severity=ValidationResult.FAIL,
                message=f"Design specification file not found: {design_spec_path}",
                location=design_spec_path
            ))
            return self.issues

        # Read and analyze design specification
        try:
            content = path.read_text(encoding='utf-8')
            self._validate_accessibility_compliance(content, str(path))
        except Exception as e:
            self.issues.append(ValidationIssue(
                type="file_read_error",
                severity=ValidationResult.FAIL,
                message=f"Could not read design specification: {e}",
                location=design_spec_path
            ))

        return self.issues

    def _validate_file_naming(self, path: Path) -> None:
        """Validate file naming conventions."""
        pattern = self.config["file_naming"]["pattern"]
        max_length = self.config["file_naming"]["max_length"]

        # Check file name length
        if len(path.name) > max_length:
            self.issues.append(ValidationIssue(
                type="naming_length",
                severity=ValidationResult.WARN,
                message=f"File name too long ({len(path.name)} > {max_length} characters)",
                location=str(path),
                suggestion="Use shorter, descriptive file names"
            ))

        # Check naming pattern
        if not re.match(pattern, path.name.lower()):
            self.issues.append(ValidationIssue(
                type="naming_pattern",
                severity=ValidationResult.WARN,
                message=f"File name doesn't follow naming convention: {path.name}",
                location=str(path),
                suggestion="Use lowercase, numbers, and hyphens only"
            ))

    def _validate_image_file(self, path: Path) -> None:
        """Validate image file properties."""
        # Check file size
        size_mb = path.stat().st_size / (1024 * 1024)
        max_size = self.config["performance"]["max_image_size_mb"]

        if size_mb > max_size:
            self.issues.append(ValidationIssue(
                type="file_size",
                severity=ValidationResult.WARN,
                message=f"Image file too large: {size_mb:.1f}MB > {max_size}MB",
                location=str(path),
                suggestion="Optimize image or use WebP format"
            ))

        # Check for appropriate format
        if path.suffix.lower() in ['.jpg', '.jpeg'] and 'screenshot' in path.name.lower():
            self.issues.append(ValidationIssue(
                type="format_recommendation",
                severity=ValidationResult.WARN,
                message="Screenshot saved as JPEG, consider PNG for better quality",
                location=str(path),
                suggestion="Use PNG for screenshots with text or sharp edges"
            ))

    def _validate_svg_file(self, path: Path) -> None:
        """Validate SVG file for accessibility and performance."""
        try:
            content = path.read_text(encoding='utf-8')

            # Check for accessibility issues
            if not re.search(r'<title[^>]*>', content):
                self.issues.append(ValidationIssue(
                    type="accessibility",
                    severity=ValidationResult.WARN,
                    message="SVG missing title element for screen readers",
                    location=str(path),
                    suggestion="Add <title> element to describe the SVG content"
                ))

            # Check for unnecessary elements
            if re.search(r'width="[^"]*"\s+height="[^"]*"', content) and 'viewBox' not in content:
                self.issues.append(ValidationIssue(
                    type="svg_optimization",
                    severity=ValidationResult.WARN,
                    message="SVG has width/height but no viewBox for scalability",
                    location=str(path),
                    suggestion="Add viewBox attribute for better scalability"
                ))

        except Exception as e:
            self.issues.append(ValidationIssue(
                type="svg_read_error",
                severity=ValidationResult.FAIL,
                message=f"Could not read SVG file: {e}",
                location=str(path)
            ))

    def _validate_design_tool_file(self, path: Path) -> None:
        """Validate Figma/Sketch files for best practices."""
        # These files are binary, so we can't analyze content directly
        # But we can check for related files and documentation

        # Look for export documentation
        docs_path = path.parent / f"{path.stem}_export_info.md"
        if not docs_path.exists():
            self.issues.append(ValidationIssue(
                type="missing_documentation",
                severity=ValidationResult.WARN,
                message=f"Missing export documentation for design file: {path.name}",
                location=str(path),
                suggestion=f"Create {docs_path.name} with export specifications"
            ))

    def _validate_json_file(self, path: Path) -> None:
        """Validate JSON file structure and content."""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Validate based on expected structure
            if 'tokens' in str(path).lower():
                self._validate_token_structure(data, str(path))
            elif 'components' in str(path).lower():
                self._validate_component_structure(data, str(path))

        except json.JSONDecodeError as e:
            self.issues.append(ValidationIssue(
                type="json_syntax",
                severity=ValidationResult.FAIL,
                message=f"Invalid JSON syntax: {e}",
                location=str(path)
            ))
        except Exception as e:
            self.issues.append(ValidationIssue(
                type="file_read_error",
                severity=ValidationResult.FAIL,
                message=f"Could not read JSON file: {e}",
                location=str(path)
            ))

    def _validate_design_tokens(self, tokens_path: Path) -> None:
        """Validate design tokens structure."""
        try:
            with open(tokens_path, 'r', encoding='utf-8') as f:
                tokens = json.load(f)

            required_categories = ['color', 'typography', 'spacing', 'shadows']
            for category in required_categories:
                if category not in tokens:
                    self.issues.append(ValidationIssue(
                        type="missing_token_category",
                        severity=ValidationResult.WARN,
                        message=f"Missing design token category: {category}",
                        location=str(tokens_path),
                        suggestion=f"Add {category} tokens to complete the design system"
                    ))

            # Validate color tokens for accessibility
            if 'color' in tokens:
                self._validate_color_tokens(tokens['color'], str(tokens_path))

        except Exception as e:
            self.issues.append(ValidationIssue(
                type="tokens_validation_error",
                severity=ValidationResult.FAIL,
                message=f"Error validating design tokens: {e}",
                location=str(tokens_path)
            ))

    def _validate_components(self, components_path: Path) -> None:
        """Validate component definitions."""
        try:
            with open(components_path, 'r', encoding='utf-8') as f:
                components = json.load(f)

            if not isinstance(components, dict):
                self.issues.append(ValidationIssue(
                    type="invalid_components_structure",
                    severity=ValidationResult.FAIL,
                    message="Components file should be a JSON object with component definitions",
                    location=str(components_path)
                ))
                return

            for component_name, component_data in components.items():
                if not isinstance(component_data, dict):
                    self.issues.append(ValidationIssue(
                        type="invalid_component_definition",
                        severity=ValidationResult.FAIL,
                        message=f"Component '{component_name}' should be an object with component properties",
                        location=str(components_path)
                    ))
                    continue

                # Check for required component properties
                required_props = ['description', 'props', 'variants']
                for prop in required_props:
                    if prop not in component_data:
                        self.issues.append(ValidationIssue(
                            type="missing_component_property",
                            severity=ValidationResult.WARN,
                            message=f"Component '{component_name}' missing required property: {prop}",
                            location=str(components_path),
                            suggestion=f"Add {prop} property to complete component definition"
                        ))

        except Exception as e:
            self.issues.append(ValidationIssue(
                type="components_validation_error",
                severity=ValidationResult.FAIL,
                message=f"Error validating components: {e}",
                location=str(components_path)
            ))

    def _validate_accessibility_compliance(self, content: str, file_path: str) -> None:
        """Validate accessibility compliance in design specifications."""
        # Check for accessibility mentions
        accessibility_keywords = ['wcag', 'accessibility', 'screen reader', 'keyboard', 'contrast']
        has_accessibility_section = any(keyword in content.lower() for keyword in accessibility_keywords)

        if not has_accessibility_section:
            self.issues.append(ValidationIssue(
                type="missing_accessibility",
                severity=ValidationResult.WARN,
                message="Design specification doesn't mention accessibility considerations",
                location=file_path,
                suggestion="Add accessibility section with WCAG compliance details"
            ))

        # Check for color contrast mentions
        if 'contrast' not in content.lower():
            self.issues.append(ValidationIssue(
                type="missing_contrast_specification",
                severity=ValidationResult.WARN,
                message="Design specification doesn't mention color contrast requirements",
                location=file_path,
                suggestion="Specify color contrast ratios (4.5:1 for normal text, 3:1 for large text)"
            ))

        # Check for keyboard navigation
        if 'keyboard' not in content.lower():
            self.issues.append(ValidationIssue(
                type="missing_keyboard_navigation",
                severity=ValidationResult.WARN,
                message="Design specification doesn't mention keyboard navigation",
                location=file_path,
                suggestion="Specify keyboard navigation patterns and focus indicators"
            ))

    def _validate_token_structure(self, data: dict, file_path: str) -> None:
        """Validate design token structure."""
        if not isinstance(data, dict):
            self.issues.append(ValidationIssue(
                type="invalid_tokens_structure",
                severity=ValidationResult.FAIL,
                message="Design tokens should be organized as categories",
                location=file_path
            ))

    def _validate_component_structure(self, data: dict, file_path: str) -> None:
        """Validate component structure."""
        # This is similar to _validate_components but for general component JSON
        pass

    def _validate_color_tokens(self, color_data: dict, file_path: str) -> None:
        """Validate color tokens for accessibility."""
        # Check for contrast pairs
        if 'contrast' not in color_data and 'pairs' not in color_data:
            self.issues.append(ValidationIssue(
                type="missing_contrast_pairs",
                severity=ValidationResult.WARN,
                message="Color tokens missing contrast ratio specifications",
                location=file_path,
                suggestion="Add contrast pair specifications to ensure accessibility"
            ))

    def generate_report(self, output_file: Optional[str] = None) -> str:
        """Generate a validation report.

        Args:
            output_file: Optional file path to save the report

        Returns:
            Validation report as string
        """
        report_lines = []
        report_lines.append("# Design Validation Report")
        report_lines.append(f"Generated: {self._get_timestamp()}")
        report_lines.append("")

        # Summary
        fail_count = sum(1 for issue in self.issues if issue.severity == ValidationResult.FAIL)
        warn_count = sum(1 for issue in self.issues if issue.severity == ValidationResult.WARN)
        pass_count = len(self.issues) - fail_count - warn_count

        report_lines.append("## Summary")
        report_lines.append(f"- ✅ Pass: {pass_count}")
        report_lines.append(f"- ⚠️  Warning: {warn_count}")
        report_lines.append(f"- ❌ Fail: {fail_count}")
        report_lines.append(f"- 📊 Total: {len(self.issues)} issues")
        report_lines.append("")

        if not self.issues:
            report_lines.append("🎉 All validations passed!")
        else:
            # Group issues by severity
            report_lines.append("## Issues by Severity")
            report_lines.append("")

            # Critical issues first
            critical_issues = [i for i in self.issues if i.severity == ValidationResult.FAIL]
            if critical_issues:
                report_lines.append("### ❌ Critical Issues")
                for issue in critical_issues:
                    report_lines.append(f"- **{issue.type}**: {issue.message}")
                    report_lines.append(f"  - Location: {issue.location}")
                    if issue.suggestion:
                        report_lines.append(f"  - Suggestion: {issue.suggestion}")
                    report_lines.append("")

            # Warnings next
            warning_issues = [i for i in self.issues if i.severity == ValidationResult.WARN]
            if warning_issues:
                report_lines.append("### ⚠️  Warnings")
                for issue in warning_issues:
                    report_lines.append(f"- **{issue.type}**: {issue.message}")
                    report_lines.append(f"  - Location: {issue.location}")
                    if issue.suggestion:
                        report_lines.append(f"  - Suggestion: {issue.suggestion}")
                    report_lines.append("")

        report_lines.append("## Recommendations")
        report_lines.append("1. Address critical issues before proceeding to development")
        report_lines.append("2. Review warnings and implement where applicable")
        report_lines.append("3. Update design documentation with missing information")
        report_lines.append("4. Consider accessibility implications for all design decisions")
        report_lines.append("5. Validate designs with real users and accessibility tools")

        report = "\n".join(report_lines)

        if output_file:
            Path(output_file).write_text(report, encoding='utf-8')

        return report

    def _get_timestamp(self) -> str:
        """Get current timestamp for report."""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def main():
    """Command line interface for the design validator."""
    import argparse

    parser = argparse.ArgumentParser(description="Validate AURA design deliverables")
    parser.add_argument("path", help="Path to file or directory to validate")
    parser.add_argument("--type", choices=["file", "design-system", "accessibility"],
                       default="file", help="Type of validation to perform")
    parser.add_argument("--config", help="Path to configuration file")
    parser.add_argument("--output", help="Output file for validation report")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")

    args = parser.parse_args()

    validator = DesignValidator(args.config)

    if args.type == "file":
        issues = validator.validate_design_file(args.path)
    elif args.type == "design-system":
        issues = validator.validate_design_system(args.path)
    elif args.type == "accessibility":
        issues = validator.validate_accessibility(args.path)

    # Generate report
    report = validator.generate_report(args.output)

    if args.verbose or not args.output:
        print(report)

    if args.output:
        print(f"Validation report saved to: {args.output}")

    # Exit with appropriate code
    critical_issues = [i for i in issues if i.severity == ValidationResult.FAIL]
    sys.exit(1 if critical_issues else 0)

if __name__ == "__main__":
    main()