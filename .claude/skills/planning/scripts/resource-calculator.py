#!/usr/bin/env python3
"""
Resource Calculator for Planning Skill

This script calculates team capacity, resource allocation, and utilization
for agile planning and resource management.
"""

import json
import csv
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import argparse

class TeamMember:
    def __init__(self, name: str, role: str, skills: List[str],
                 capacity_hours: float, availability: float = 1.0):
        self.name = name
        self.role = role
        self.skills = skills
        self.capacity_hours = capacity_hours
        self.availability = availability
        self.allocated_hours = 0
        self.assigned_tasks = []

    @property
    def available_capacity(self) -> float:
        return self.capacity_hours * self.availability - self.allocated_hours

    def allocate_task(self, task_hours: float, task_name: str):
        if task_hours <= self.available_capacity:
            self.allocated_hours += task_hours
            self.assigned_tasks.append(task_name)
            return True
        return False

class Task:
    def __init__(self, name: str, story_points: int, required_skills: List[str],
                 complexity: str = "medium"):
        self.name = name
        self.story_points = story_points
        self.required_skills = required_skills
        self.complexity = complexity
        self.assigned_to = None
        self.estimated_hours = self._estimate_hours()

    def _estimate_hours(self) -> float:
        """Convert story points to hours based on complexity."""
        base_hours = {
            "low": 2,      # 2 hours per story point
            "medium": 3,   # 3 hours per story point
            "high": 4      # 4 hours per story point
        }
        return self.story_points * base_hours.get(self.complexity, 3)

class ResourceCalculator:
    def __init__(self, team_data: List[Dict], sprint_duration_weeks: int = 2):
        self.team_members = self._build_team(team_data)
        self.sprint_duration = sprint_duration_weeks
        self.tasks = []

    def _build_team(self, team_data: List[Dict]) -> List[TeamMember]:
        """Build team member objects from data."""
        team = []
        for member_data in team_data:
            member = TeamMember(
                name=member_data["name"],
                role=member_data["role"],
                skills=member_data["skills"],
                capacity_hours=member_data["capacity_hours"],
                availability=member_data.get("availability", 1.0)
            )
            team.append(member)
        return team

    def add_task(self, task: Task):
        """Add a task to the planning queue."""
        self.tasks.append(task)

    def calculate_team_capacity(self) -> Dict[str, float]:
        """Calculate total team capacity for the sprint."""
        total_capacity = 0
        role_capacity = {}

        for member in self.team_members:
            member_capacity = member.available_capacity
            total_capacity += member_capacity

            if member.role not in role_capacity:
                role_capacity[member.role] = 0
            role_capacity[member.role] += member_capacity

        return {
            "total_capacity": total_capacity,
            "role_capacity": role_capacity,
            "individual_capacity": {
                member.name: member.available_capacity
                for member in self.team_members
            }
        }

    def allocate_tasks_optimally(self) -> Dict[str, any]:
        """Allocate tasks to team members based on skills and capacity."""
        # Sort tasks by story points (largest first for optimal allocation)
        sorted_tasks = sorted(self.tasks, key=lambda t: t.story_points, reverse=True)

        allocation_results = []
        total_story_points = 0
        total_allocated_hours = 0

        for task in sorted_tasks:
            # Find best match for task requirements
            best_member = self._find_best_team_member(task)

            if best_member:
                success = best_member.allocate_task(task.estimated_hours, task.name)
                if success:
                    task.assigned_to = best_member.name
                    total_story_points += task.story_points
                    total_allocated_hours += task.estimated_hours

                    allocation_results.append({
                        "task": task.name,
                        "assigned_to": best_member.name,
                        "role": best_member.role,
                        "story_points": task.story_points,
                        "estimated_hours": task.estimated_hours,
                        "skills_matched": list(set(task.required_skills) & set(best_member.skills))
                    })

        # Calculate team utilization
        total_capacity = sum(member.capacity_hours * member.availability
                           for member in self.team_members)
        utilization = (total_allocated_hours / total_capacity) * 100 if total_capacity > 0 else 0

        return {
            "allocations": allocation_results,
            "total_story_points": total_story_points,
            "total_allocated_hours": total_allocated_hours,
            "team_utilization": utilization,
            "unallocated_tasks": [task.name for task in self.tasks if not task.assigned_to],
            "team_member_status": self._get_team_status()
        }

    def _find_best_team_member(self, task: Task) -> TeamMember:
        """Find the best team member for a task based on skills and capacity."""
        candidates = []

        for member in self.team_members:
            # Check if member has required skills and capacity
            skill_match = len(set(task.required_skills) & set(member.skills))
            if skill_match > 0 and member.available_capacity >= task.estimated_hours:
                # Calculate score based on skill match and availability
                score = skill_match - (member.allocated_hours / member.capacity_hours)
                candidates.append((member, score))

        # Return member with highest score
        if candidates:
            return max(candidates, key=lambda x: x[1])[0]
        return None

    def _get_team_status(self) -> List[Dict]:
        """Get current status of all team members."""
        return [
            {
                "name": member.name,
                "role": member.role,
                "total_capacity": member.capacity_hours * member.availability,
                "allocated_hours": member.allocated_hours,
                "available_hours": member.available_capacity,
                "utilization": (member.allocated_hours / (member.capacity_hours * member.availability)) * 100,
                "assigned_tasks": member.assigned_tasks
            }
            for member in self.team_members
        ]

    def generate_allocation_report(self) -> str:
        """Generate a comprehensive allocation report."""
        capacity_info = self.calculate_team_capacity()
        allocation_info = self.allocate_tasks_optimally()

        report = []
        report.append("# Resource Allocation Report")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Sprint Duration: {self.sprint_duration} weeks")
        report.append("")

        # Executive Summary
        report.append("## Executive Summary")
        report.append(f"- Total Team Capacity: {capacity_info['total_capacity']:.1f} hours")
        report.append(f"- Total Story Points Planned: {allocation_info['total_story_points']}")
        report.append(f"- Total Hours Allocated: {allocation_info['total_allocated_hours']:.1f} hours")
        report.append(f"- Team Utilization: {allocation_info['team_utilization']:.1f}%")
        report.append("")

        # Task Allocation
        report.append("## Task Allocation")
        for allocation in allocation_info['allocations']:
            report.append(f"### {allocation['task']}")
            report.append(f"- **Assigned to**: {allocation['assigned_to']} ({allocation['role']})")
            report.append(f"- **Story Points**: {allocation['story_points']}")
            report.append(f"- **Estimated Hours**: {allocation['estimated_hours']:.1f}")
            report.append(f"- **Skills Matched**: {', '.join(allocation['skills_matched'])}")
            report.append("")

        # Team Member Status
        report.append("## Team Member Status")
        for member_status in allocation_info['team_member_status']:
            report.append(f"### {member_status['name']} ({member_status['role']})")
            report.append(f"- **Total Capacity**: {member_status['total_capacity']:.1f} hours")
            report.append(f"- **Allocated**: {member_status['allocated_hours']:.1f} hours")
            report.append(f"- **Available**: {member_status['available_hours']:.1f} hours")
            report.append(f"- **Utilization**: {member_status['utilization']:.1f}%")
            report.append(f"- **Assigned Tasks**: {', '.join(member_status['assigned_tasks'])}")
            report.append("")

        # Issues and Recommendations
        if allocation_info['unallocated_tasks']:
            report.append("## Unallocated Tasks")
            for task in allocation_info['unallocated_tasks']:
                report.append(f"- {task}")
            report.append("")

        # Recommendations
        report.append("## Recommendations")
        if allocation_info['team_utilization'] > 90:
            report.append("- ⚠️  High team utilization (>90%). Consider reducing scope or adding resources.")
        elif allocation_info['team_utilization'] < 70:
            report.append("- 💡 Low team utilization (<70%). Consider adding more tasks to the sprint.")
        else:
            report.append("- ✅ Team utilization is optimal (70-90%).")

        if allocation_info['unallocated_tasks']:
            report.append("- 📋 Some tasks remain unallocated. Review skill requirements or team capacity.")

        return "\n".join(report)

def load_team_from_csv(csv_file: str) -> List[Dict]:
    """Load team data from CSV file."""
    team_data = []
    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            team_data.append({
                "name": row["name"],
                "role": row["role"],
                "skills": row["skills"].split(","),
                "capacity_hours": float(row["capacity_hours"]),
                "availability": float(row.get("availability", 1.0))
            })
    return team_data

def load_tasks_from_json(json_file: str) -> List[Task]:
    """Load tasks from JSON file."""
    tasks = []
    with open(json_file, 'r') as file:
        tasks_data = json.load(file)
        for task_data in tasks_data:
            task = Task(
                name=task_data["name"],
                story_points=task_data["story_points"],
                required_skills=task_data["required_skills"],
                complexity=task_data.get("complexity", "medium")
            )
            tasks.append(task)
    return tasks

def main():
    parser = argparse.ArgumentParser(description="Resource Calculator for Agile Planning")
    parser.add_argument("--team-csv", required=True, help="CSV file with team member data")
    parser.add_argument("--tasks-json", required=True, help="JSON file with task definitions")
    parser.add_argument("--sprint-weeks", type=int, default=2, help="Sprint duration in weeks")
    parser.add_argument("--output", help="Output file for allocation report")

    args = parser.parse_args()

    # Load team and tasks
    team_data = load_team_from_csv(args.team_csv)
    tasks = load_tasks_from_json(args.tasks_json)

    # Create calculator and add tasks
    calculator = ResourceCalculator(team_data, args.sprint_weeks)
    for task in tasks:
        calculator.add_task(task)

    # Generate report
    report = calculator.generate_allocation_report()

    # Output report
    if args.output:
        with open(args.output, 'w') as file:
            file.write(report)
        print(f"Allocation report saved to {args.output}")
    else:
        print(report)

if __name__ == "__main__":
    main()