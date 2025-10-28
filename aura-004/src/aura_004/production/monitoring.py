"""
Production monitoring system for AURA-004.

This module provides comprehensive monitoring capabilities including
metrics collection, performance tracking, health checks, alerting,
and distributed tracing.
"""

import asyncio
import json
import time
import psutil
import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, field, asdict
from enum import Enum
from collections import defaultdict, deque
import threading
import queue

from aura_004.core.config import get_settings
from aura_004.core.exceptions import MonitoringError


class MetricType(Enum):
    """Types of metrics."""

    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    TIMER = "timer"


class AlertSeverity(Enum):
    """Alert severity levels."""

    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class Metric:
    """Metric data point."""

    name: str
    value: float
    metric_type: MetricType
    timestamp: datetime = field(default_factory=datetime.now)
    labels: Dict[str, str] = field(default_factory=dict)
    unit: str = ""


@dataclass
class Alert:
    """Alert information."""

    id: str
    name: str
    severity: AlertSeverity
    message: str
    timestamp: datetime = field(default_factory=datetime.now)
    resolved: bool = False
    resolved_at: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class HealthCheck:
    """Health check result."""

    name: str
    status: str  # "healthy", "unhealthy", "degraded"
    message: str
    timestamp: datetime = field(default_factory=datetime.now)
    response_time: float = 0.0
    details: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PerformanceTrace:
    """Performance trace information."""

    trace_id: str
    span_id: str
    parent_span_id: Optional[str]
    operation_name: str
    start_time: datetime
    end_time: datetime
    duration: float
    status: str
    tags: Dict[str, str] = field(default_factory=dict)
    logs: List[Dict[str, Any]] = field(default_factory=dict)


class MetricsCollector:
    """Collects and manages metrics."""

    def __init__(self, max_metrics: int = 10000):
        self.max_metrics = max_metrics
        self.metrics: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        self.counters: Dict[str, float] = defaultdict(float)
        self.gauges: Dict[str, float] = defaultdict(float)
        self.histograms: Dict[str, List[float]] = defaultdict(list)
        self.timers: Dict[str, List[float]] = defaultdict(list)
        self._lock = threading.Lock()

    def increment_counter(self, name: str, value: float = 1.0, labels: Dict[str, str] = None) -> None:
        """Increment a counter metric."""
        with self._lock:
            key = self._make_key(name, labels)
            self.counters[key] += value

            metric = Metric(
                name=name,
                value=self.counters[key],
                metric_type=MetricType.COUNTER,
                labels=labels or {},
            )
            self.metrics[name].append(metric)

    def set_gauge(self, name: str, value: float, labels: Dict[str, str] = None) -> None:
        """Set a gauge metric."""
        with self._lock:
            key = self._make_key(name, labels)
            self.gauges[key] = value

            metric = Metric(
                name=name,
                value=value,
                metric_type=MetricType.GAUGE,
                labels=labels or {},
            )
            self.metrics[name].append(metric)

    def record_histogram(self, name: str, value: float, labels: Dict[str, str] = None) -> None:
        """Record a histogram metric."""
        with self._lock:
            key = self._make_key(name, labels)
            self.histograms[key].append(value)

            # Keep only recent values
            if len(self.histograms[key]) > 1000:
                self.histograms[key] = self.histograms[key][-1000:]

            metric = Metric(
                name=name,
                value=value,
                metric_type=MetricType.HISTOGRAM,
                labels=labels or {},
            )
            self.metrics[name].append(metric)

    def record_timer(self, name: str, duration: float, labels: Dict[str, str] = None) -> None:
        """Record a timer metric."""
        with self._lock:
            key = self._make_key(name, labels)
            self.timers[key].append(duration)

            # Keep only recent values
            if len(self.timers[key]) > 1000:
                self.timers[key] = self.timers[key][-1000:]

            metric = Metric(
                name=name,
                value=duration,
                metric_type=MetricType.TIMER,
                unit="seconds",
                labels=labels or {},
            )
            self.metrics[name].append(metric)

    def _make_key(self, name: str, labels: Dict[str, str] = None) -> str:
        """Create a key for labeled metrics."""
        if not labels:
            return name
        label_str = ",".join(f"{k}={v}" for k, v in sorted(labels.items()))
        return f"{name}{{{label_str}}}"

    def get_metric(self, name: str, labels: Dict[str, str] = None) -> Optional[Metric]:
        """Get the latest metric value."""
        with self._lock:
            key = self._make_key(name, labels)
            if name in self.metrics and self.metrics[name]:
                return self.metrics[name][-1]
        return None

    def get_metrics_summary(self, name: str) -> Dict[str, Any]:
        """Get summary statistics for a metric."""
        with self._lock:
            if name not in self.metrics:
                return {}

            metrics_list = list(self.metrics[name])
            if not metrics_list:
                return {}

            values = [m.value for m in metrics_list]
            return {
                "count": len(values),
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
                "latest": values[-1] if values else None,
            }

    def get_all_metrics(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get all metrics in a serializable format."""
        result = {}
        with self._lock:
            for name, metric_deque in self.metrics.items():
                result[name] = [asdict(metric) for metric in metric_deque]
        return result

    def clear_metrics(self, name: Optional[str] = None) -> None:
        """Clear metrics."""
        with self._lock:
            if name:
                if name in self.metrics:
                    del self.metrics[name]
                # Clear from specific metric types
                keys_to_remove = [k for k in self.counters.keys() if k.startswith(name)]
                for key in keys_to_remove:
                    del self.counters[key]
                keys_to_remove = [k for k in self.gauges.keys() if k.startswith(name)]
                for key in keys_to_remove:
                    del self.gauges[key]
            else:
                self.metrics.clear()
                self.counters.clear()
                self.gauges.clear()
                self.histograms.clear()
                self.timers.clear()


class AlertManager:
    """Manages alerts and alerting rules."""

    def __init__(self):
        self.alerts: Dict[str, Alert] = {}
        self.alert_rules: List[Dict[str, Any]] = []
        self.alert_callbacks: List[Callable[[Alert], None]] = []
        self._lock = threading.Lock()

    def add_alert_rule(self, rule: Dict[str, Any]) -> None:
        """Add an alerting rule."""
        self.alert_rules.append(rule)

    def add_alert_callback(self, callback: Callable[[Alert], None]) -> None:
        """Add a callback for alert notifications."""
        self.alert_callbacks.append(callback)

    def check_alerts(self, metrics_collector: MetricsCollector) -> List[Alert]:
        """Check all alert rules and trigger alerts if needed."""
        new_alerts = []

        for rule in self.alert_rules:
            try:
                alert = self._evaluate_rule(rule, metrics_collector)
                if alert:
                    new_alerts.append(alert)
                    self._trigger_alert(alert)
            except Exception as e:
                logging.error(f"Error evaluating alert rule {rule.get('name', 'unknown')}: {e}")

        return new_alerts

    def _evaluate_rule(self, rule: Dict[str, Any], metrics_collector: MetricsCollector) -> Optional[Alert]:
        """Evaluate a single alert rule."""
        metric_name = rule["metric_name"]
        condition = rule["condition"]
        threshold = rule["threshold"]
        severity = AlertSeverity(rule.get("severity", "warning"))

        metric = metrics_collector.get_metric(metric_name, rule.get("labels"))
        if not metric:
            return None

        triggered = False
        if condition == "gt":
            triggered = metric.value > threshold
        elif condition == "lt":
            triggered = metric.value < threshold
        elif condition == "eq":
            triggered = abs(metric.value - threshold) < 0.001
        elif condition == "ne":
            triggered = abs(metric.value - threshold) >= 0.001

        if triggered:
            alert_id = f"{metric_name}_{condition}_{threshold}"

            # Check if alert already exists
            if alert_id in self.alerts and not self.alerts[alert_id].resolved:
                return None  # Alert already active

            alert = Alert(
                id=alert_id,
                name=rule.get("name", f"Alert for {metric_name}"),
                severity=severity,
                message=rule.get("message", f"Metric {metric_name} is {metric.value} (threshold: {threshold})"),
                metadata={
                    "metric_name": metric_name,
                    "current_value": metric.value,
                    "threshold": threshold,
                    "condition": condition,
                }
            )

            return alert

        return None

    def _trigger_alert(self, alert: Alert) -> None:
        """Trigger an alert."""
        with self._lock:
            self.alerts[alert.id] = alert

        # Notify callbacks
        for callback in self.alert_callbacks:
            try:
                callback(alert)
            except Exception as e:
                logging.error(f"Error in alert callback: {e}")

    def resolve_alert(self, alert_id: str) -> bool:
        """Resolve an alert."""
        with self._lock:
            if alert_id in self.alerts:
                self.alerts[alert_id].resolved = True
                self.alerts[alert_id].resolved_at = datetime.now()
                return True
        return False

    def get_active_alerts(self) -> List[Alert]:
        """Get all active (unresolved) alerts."""
        with self._lock:
            return [alert for alert in self.alerts.values() if not alert.resolved]

    def get_all_alerts(self) -> List[Alert]:
        """Get all alerts."""
        with self._lock:
            return list(self.alerts.values())


class HealthChecker:
    """Manages health checks."""

    def __init__(self):
        self.health_checks: Dict[str, Callable] = {}
        self.last_results: Dict[str, HealthCheck] = {}

    def register_health_check(self, name: str, check_func: Callable[[], HealthCheck]) -> None:
        """Register a health check function."""
        self.health_checks[name] = check_func

    async def run_health_checks(self) -> Dict[str, HealthCheck]:
        """Run all registered health checks."""
        results = {}

        for name, check_func in self.health_checks.items():
            try:
                start_time = time.time()
                result = await asyncio.get_event_loop().run_in_executor(None, check_func)
                result.response_time = time.time() - start_time
                results[name] = result
            except Exception as e:
                results[name] = HealthCheck(
                    name=name,
                    status="unhealthy",
                    message=f"Health check failed: {e}",
                )

        self.last_results = results
        return results

    def get_overall_health(self) -> HealthCheck:
        """Get overall system health."""
        if not self.last_results:
            return HealthCheck(
                name="overall",
                status="unknown",
                message="No health checks run",
            )

        statuses = [check.status for check in self.last_results.values()]

        if "unhealthy" in statuses:
            overall_status = "unhealthy"
            message = "One or more components are unhealthy"
        elif "degraded" in statuses:
            overall_status = "degraded"
            message = "One or more components are degraded"
        else:
            overall_status = "healthy"
            message = "All components are healthy"

        return HealthCheck(
            name="overall",
            status=overall_status,
            message=message,
            details={"components": {name: check.status for name, check in self.last_results.items()}}
        )


class TracingSystem:
    """Manages distributed tracing."""

    def __init__(self, max_traces: int = 10000):
        self.max_traces = max_traces
        self.active_spans: Dict[str, PerformanceTrace] = {}
        self.completed_traces: deque = deque(maxlen=max_traces)
        self._lock = threading.Lock()

    def start_span(
        self,
        operation_name: str,
        trace_id: Optional[str] = None,
        parent_span_id: Optional[str] = None,
        tags: Dict[str, str] = None,
    ) -> str:
        """Start a new span."""
        if trace_id is None:
            trace_id = self._generate_trace_id()

        span_id = self._generate_span_id()

        span = PerformanceTrace(
            trace_id=trace_id,
            span_id=span_id,
            parent_span_id=parent_span_id,
            operation_name=operation_name,
            start_time=datetime.now(),
            end_time=datetime.now(),  # Will be updated when span ends
            duration=0.0,  # Will be calculated when span ends
            status="ongoing",
            tags=tags or {},
        )

        with self._lock:
            self.active_spans[span_id] = span

        return span_id

    def finish_span(self, span_id: str, status: str = "completed", tags: Dict[str, str] = None) -> Optional[PerformanceTrace]:
        """Finish a span."""
        with self._lock:
            if span_id not in self.active_spans:
                return None

            span = self.active_spans.pop(span_id)
            span.end_time = datetime.now()
            span.duration = (span.end_time - span.start_time).total_seconds()
            span.status = status

            if tags:
                span.tags.update(tags)

            self.completed_traces.append(span)
            return span

    def add_span_log(self, span_id: str, log_data: Dict[str, Any]) -> None:
        """Add a log entry to a span."""
        with self._lock:
            if span_id in self.active_spans:
                log_entry = {
                    "timestamp": datetime.now().isoformat(),
                    **log_data
                }
                self.active_spans[span_id].logs.append(log_entry)

    def get_trace(self, trace_id: str) -> List[PerformanceTrace]:
        """Get all spans for a trace."""
        traces = []
        with self._lock:
            # Check active spans
            for span in self.active_spans.values():
                if span.trace_id == trace_id:
                    traces.append(span)

            # Check completed traces
            for span in self.completed_traces:
                if span.trace_id == trace_id:
                    traces.append(span)

        return sorted(traces, key=lambda x: x.start_time)

    def get_recent_traces(self, limit: int = 100) -> List[PerformanceTrace]:
        """Get recent completed traces."""
        with self._lock:
            return list(self.completed_traces)[-limit:]

    def _generate_trace_id(self) -> str:
        """Generate a unique trace ID."""
        import uuid
        return str(uuid.uuid4())

    def _generate_span_id(self) -> str:
        """Generate a unique span ID."""
        import uuid
        return str(uuid.uuid4())[:16]


class ProductionMonitor:
    """Main production monitoring system."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.settings = get_settings()
        self.config = config or {}

        # Initialize components
        self.metrics_collector = MetricsCollector(
            max_metrics=self.config.get("max_metrics", 10000)
        )
        self.alert_manager = AlertManager()
        self.health_checker = HealthChecker()
        self.tracing_system = TracingSystem(
            max_traces=self.config.get("max_traces", 10000)
        )

        # Background tasks
        self.monitoring_active = False
        self.monitoring_task: Optional[asyncio.Task] = None

        # Statistics
        self.start_time = datetime.now()

    async def start(self) -> None:
        """Start the monitoring system."""
        if self.monitoring_active:
            return

        self.monitoring_active = True

        # Register default health checks
        self._register_default_health_checks()

        # Register default alert rules
        self._register_default_alert_rules()

        # Start background monitoring
        self.monitoring_task = asyncio.create_task(self._monitoring_loop())

        logging.info("Production monitoring system started")

    async def stop(self) -> None:
        """Stop the monitoring system."""
        self.monitoring_active = False

        if self.monitoring_task:
            self.monitoring_task.cancel()
            try:
                await self.monitoring_task
            except asyncio.CancelledError:
                pass

        logging.info("Production monitoring system stopped")

    def _register_default_health_checks(self) -> None:
        """Register default health checks."""
        # Memory health check
        def memory_health() -> HealthCheck:
            memory_percent = psutil.virtual_memory().percent
            if memory_percent > 90:
                status = "unhealthy"
                message = f"High memory usage: {memory_percent}%"
            elif memory_percent > 80:
                status = "degraded"
                message = f"Elevated memory usage: {memory_percent}%"
            else:
                status = "healthy"
                message = f"Memory usage normal: {memory_percent}%"

            return HealthCheck(
                name="memory",
                status=status,
                message=message,
                details={"memory_percent": memory_percent}
            )

        # CPU health check
        def cpu_health() -> HealthCheck:
            cpu_percent = psutil.cpu_percent(interval=1)
            if cpu_percent > 90:
                status = "unhealthy"
                message = f"High CPU usage: {cpu_percent}%"
            elif cpu_percent > 80:
                status = "degraded"
                message = f"Elevated CPU usage: {cpu_percent}%"
            else:
                status = "healthy"
                message = f"CPU usage normal: {cpu_percent}%"

            return HealthCheck(
                name="cpu",
                status=status,
                message=message,
                details={"cpu_percent": cpu_percent}
            )

        # Disk health check
        def disk_health() -> HealthCheck:
            disk_usage = psutil.disk_usage('/').percent
            if disk_usage > 90:
                status = "unhealthy"
                message = f"Low disk space: {disk_usage}% used"
            elif disk_usage > 80:
                status = "degraded"
                message = f"Limited disk space: {disk_usage}% used"
            else:
                status = "healthy"
                message = f"Disk space adequate: {disk_usage}% used"

            return HealthCheck(
                name="disk",
                status=status,
                message=message,
                details={"disk_usage_percent": disk_usage}
            )

        self.health_checker.register_health_check("memory", memory_health)
        self.health_checker.register_health_check("cpu", cpu_health)
        self.health_checker.register_health_check("disk", disk_health)

    def _register_default_alert_rules(self) -> None:
        """Register default alert rules."""
        # Memory alerts
        self.alert_manager.add_alert_rule({
            "name": "High Memory Usage",
            "metric_name": "system_memory_usage_percent",
            "condition": "gt",
            "threshold": 85.0,
            "severity": "warning",
            "message": "System memory usage is above 85%"
        })

        self.alert_manager.add_alert_rule({
            "name": "Critical Memory Usage",
            "metric_name": "system_memory_usage_percent",
            "condition": "gt",
            "threshold": 95.0,
            "severity": "critical",
            "message": "System memory usage is critically high"
        })

        # CPU alerts
        self.alert_manager.add_alert_rule({
            "name": "High CPU Usage",
            "metric_name": "system_cpu_usage_percent",
            "condition": "gt",
            "threshold": 80.0,
            "severity": "warning",
            "message": "System CPU usage is above 80%"
        })

    async def _monitoring_loop(self) -> None:
        """Main monitoring loop."""
        while self.monitoring_active:
            try:
                # Collect system metrics
                await self._collect_system_metrics()

                # Run health checks
                await self.health_checker.run_health_checks()

                # Check alerts
                self.alert_manager.check_alerts(self.metrics_collector)

                # Wait before next iteration
                await asyncio.sleep(self.config.get("monitoring_interval", 30))

            except asyncio.CancelledError:
                break
            except Exception as e:
                logging.error(f"Error in monitoring loop: {e}")
                await asyncio.sleep(5)  # Brief delay before retrying

    async def _collect_system_metrics(self) -> None:
        """Collect system-level metrics."""
        # Memory metrics
        memory = psutil.virtual_memory()
        self.metrics_collector.set_gauge("system_memory_usage_percent", memory.percent)
        self.metrics_collector.set_gauge("system_memory_available_bytes", memory.available)
        self.metrics_collector.set_gauge("system_memory_used_bytes", memory.used)

        # CPU metrics
        cpu_percent = psutil.cpu_percent()
        self.metrics_collector.set_gauge("system_cpu_usage_percent", cpu_percent)
        self.metrics_collector.set_gauge("system_cpu_count", psutil.cpu_count())

        # Disk metrics
        disk = psutil.disk_usage('/')
        self.metrics_collector.set_gauge("system_disk_usage_percent", disk.percent)
        self.metrics_collector.set_gauge("system_disk_free_bytes", disk.free)
        self.metrics_collector.set_gauge("system_disk_used_bytes", disk.used)

        # Process metrics
        process = psutil.Process()
        self.metrics_collector.set_gauge("process_memory_rss_bytes", process.memory_info().rss)
        self.metrics_collector.set_gauge("process_cpu_percent", process.cpu_percent())
        self.metrics_collector.set_gauge("process_num_threads", process.num_threads())

        # Application uptime
        uptime = (datetime.now() - self.start_time).total_seconds()
        self.metrics_collector.set_gauge("application_uptime_seconds", uptime)

    def record_operation(
        self,
        operation_name: str,
        duration: float,
        success: bool = True,
        tags: Dict[str, str] = None,
    ) -> None:
        """Record an operation metric."""
        labels = {"operation": operation_name, "success": str(success)}
        if tags:
            labels.update(tags)

        self.metrics_collector.record_timer(f"operation_duration_seconds", duration, labels)
        self.metrics_collector.increment_counter(f"operations_total", 1.0, labels)

    def create_span(
        self,
        operation_name: str,
        trace_id: Optional[str] = None,
        parent_span_id: Optional[str] = None,
        tags: Dict[str, str] = None,
    ) -> str:
        """Create a new tracing span."""
        return self.tracing_system.start_span(
            operation_name=operation_name,
            trace_id=trace_id,
            parent_span_id=parent_span_id,
            tags=tags,
        )

    def finish_span(
        self,
        span_id: str,
        status: str = "completed",
        tags: Dict[str, str] = None,
    ) -> None:
        """Finish a tracing span."""
        span = self.tracing_system.finish_span(span_id, status, tags)
        if span:
            # Record operation metric from span
            self.record_operation(
                operation_name=span.operation_name,
                duration=span.duration,
                success=(status == "completed"),
                tags=span.tags,
            )

    def get_monitoring_data(self) -> Dict[str, Any]:
        """Get comprehensive monitoring data."""
        return {
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": (datetime.now() - self.start_time).total_seconds(),
            "metrics": self.metrics_collector.get_all_metrics(),
            "health": {
                name: asdict(check) for name, check in self.health_checker.last_results.items()
            },
            "active_alerts": [asdict(alert) for alert in self.alert_manager.get_active_alerts()],
            "recent_traces": [asdict(trace) for trace in self.tracing_system.get_recent_traces(20)],
        }

    def get_prometheus_metrics(self) -> str:
        """Export metrics in Prometheus format."""
        metrics_text = []

        # Convert metrics to Prometheus format
        for name, metric_deque in self.metrics_collector.metrics.items():
            if metric_deque:
                latest_metric = metric_deque[-1]
                labels_str = ""
                if latest_metric.labels:
                    labels_str = "{" + ",".join(f'{k}="{v}"' for k, v in latest_metric.labels.items()) + "}"

                metrics_text.append(f"{name}{labels_str} {latest_metric.value}")

        # Add health status as metrics
        for name, check in self.health_checker.last_results.items():
            status_value = 1.0 if check.status == "healthy" else (0.5 if check.status == "degraded" else 0.0)
            metrics_text.append(f'health_status{{component="{name}"}} {status_value}')

        # Add alert metrics
        for severity in AlertSeverity:
            count = len([a for a in self.alert_manager.get_active_alerts() if a.severity == severity])
            metrics_text.append(f'alerts_active{{severity="{severity.value}"}} {count}')

        return "\n".join(metrics_text)


# Context manager for tracing operations
class TraceContext:
    """Context manager for tracing operations."""

    def __init__(
        self,
        monitor: ProductionMonitor,
        operation_name: str,
        trace_id: Optional[str] = None,
        parent_span_id: Optional[str] = None,
        tags: Dict[str, str] = None,
    ):
        self.monitor = monitor
        self.operation_name = operation_name
        self.trace_id = trace_id
        self.parent_span_id = parent_span_id
        self.tags = tags or {}
        self.span_id: Optional[str] = None
        self.start_time: Optional[float] = None

    def __enter__(self) -> "TraceContext":
        self.span_id = self.monitor.create_span(
            operation_name=self.operation_name,
            trace_id=self.trace_id,
            parent_span_id=self.parent_span_id,
            tags=self.tags,
        )
        self.start_time = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        if self.span_id:
            status = "completed"
            if exc_type is not None:
                status = "error"
                self.monitor.tracing_system.add_span_log(
                    self.span_id,
                    {"error": str(exc_val), "error_type": exc_type.__name__}
                )

            self.monitor.finish_span(self.span_id, status=status)


# Global monitoring instance
_monitor: Optional[ProductionMonitor] = None


def get_monitor() -> ProductionMonitor:
    """Get the global monitoring instance."""
    global _monitor
    if _monitor is None:
        _monitor = ProductionMonitor()
    return _monitor


async def start_monitoring(config: Optional[Dict[str, Any]] = None) -> ProductionMonitor:
    """Start the global monitoring system."""
    monitor = get_monitor()
    if config:
        monitor.config.update(config)
    await monitor.start()
    return monitor


async def stop_monitoring() -> None:
    """Stop the global monitoring system."""
    monitor = get_monitor()
    await monitor.stop()


def trace_operation(
    operation_name: str,
    trace_id: Optional[str] = None,
    parent_span_id: Optional[str] = None,
    tags: Dict[str, str] = None,
) -> TraceContext:
    """Create a tracing context for an operation."""
    monitor = get_monitor()
    return TraceContext(
        monitor=monitor,
        operation_name=operation_name,
        trace_id=trace_id,
        parent_span_id=parent_span_id,
        tags=tags,
    )


def record_metric(
    name: str,
    value: float,
    metric_type: MetricType = MetricType.GAUGE,
    labels: Dict[str, str] = None,
) -> None:
    """Record a metric."""
    monitor = get_monitor()

    if metric_type == MetricType.COUNTER:
        monitor.metrics_collector.increment_counter(name, value, labels)
    elif metric_type == MetricType.GAUGE:
        monitor.metrics_collector.set_gauge(name, value, labels)
    elif metric_type == MetricType.HISTOGRAM:
        monitor.metrics_collector.record_histogram(name, value, labels)
    elif metric_type == MetricType.TIMER:
        monitor.metrics_collector.record_timer(name, value, labels)


def register_health_check(name: str, check_func: Callable[[], HealthCheck]) -> None:
    """Register a health check."""
    monitor = get_monitor()
    monitor.health_checker.register_health_check(name, check_func)


def register_alert_rule(rule: Dict[str, Any]) -> None:
    """Register an alert rule."""
    monitor = get_monitor()
    monitor.alert_manager.add_alert_rule(rule)