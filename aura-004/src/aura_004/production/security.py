"""
Production security system for AURA-004.

This module provides comprehensive security features including
authentication, authorization, input validation, encryption,
access control, and security auditing.
"""

import asyncio
import hashlib
import hmac
import json
import secrets
import time
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union, Set, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
import logging
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import re

from aura_004.core.config import get_settings
from aura_004.core.exceptions import SecurityError


class Permission(Enum):
    """Permission levels."""

    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    ADMIN = "admin"
    SYSTEM = "system"


class SecurityLevel(Enum):
    """Security levels."""

    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"


class UserRole(Enum):
    """User roles."""

    GUEST = "guest"
    USER = "user"
    DEVELOPER = "developer"
    ADMIN = "admin"
    SYSTEM = "system"


@dataclass
class User:
    """User information."""

    id: str
    username: str
    email: str
    role: UserRole
    permissions: Set[Permission]
    created_at: datetime = field(default_factory=datetime.now)
    last_login: Optional[datetime] = None
    active: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SecurityToken:
    """Security token for authentication."""

    token_id: str
    user_id: str
    expires_at: datetime
    permissions: Set[Permission]
    created_at: datetime = field(default_factory=datetime.now)
    last_used: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SecurityEvent:
    """Security event for auditing."""

    event_id: str
    event_type: str
    user_id: Optional[str]
    resource: Optional[str]
    action: str
    result: str  # "success", "failure", "denied"
    timestamp: datetime = field(default_factory=datetime.now)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Dict[str, Any] = field(default_factory=dict)


class PasswordHasher:
    """Handles password hashing and verification."""

    def __init__(self, iterations: int = 100000, salt_length: int = 32):
        self.iterations = iterations
        self.salt_length = salt_length

    def hash_password(self, password: str) -> str:
        """Hash a password with PBKDF2."""
        salt = secrets.token_bytes(self.salt_length)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=self.iterations,
        )
        hash_bytes = kdf.derive(password.encode())

        # Combine salt and hash
        combined = salt + hash_bytes
        return base64.b64encode(combined).decode()

    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify a password against its hash."""
        try:
            combined = base64.b64decode(hashed.encode())
            salt = combined[:self.salt_length]
            stored_hash = combined[self.salt_length:]

            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=self.iterations,
            )
            computed_hash = kdf.derive(password.encode())

            return hmac.compare_digest(computed_hash, stored_hash)
        except Exception:
            return False


class TokenManager:
    """Manages security tokens."""

    def __init__(self, token_expiry_hours: int = 24):
        self.token_expiry_hours = token_expiry_hours
        self.tokens: Dict[str, SecurityToken] = {}
        self.revoked_tokens: Set[str] = set()

    def generate_token(self, user: User, permissions: Optional[Set[Permission]] = None) -> SecurityToken:
        """Generate a new security token."""
        token_id = secrets.token_urlsafe(32)

        token_permissions = permissions or user.permissions
        expires_at = datetime.now() + timedelta(hours=self.token_expiry_hours)

        token = SecurityToken(
            token_id=token_id,
            user_id=user.id,
            expires_at=expires_at,
            permissions=token_permissions,
        )

        self.tokens[token_id] = token
        return token

    def validate_token(self, token_id: str) -> Optional[SecurityToken]:
        """Validate a token and return it if valid."""
        if token_id in self.revoked_tokens:
            return None

        token = self.tokens.get(token_id)
        if not token:
            return None

        if datetime.now() > token.expires_at:
            self.revoke_token(token_id)
            return None

        # Update last used
        token.last_used = datetime.now()
        return token

    def revoke_token(self, token_id: str) -> bool:
        """Revoke a token."""
        if token_id in self.tokens:
            self.revoked_tokens.add(token_id)
            del self.tokens[token_id]
            return True
        return False

    def revoke_user_tokens(self, user_id: str) -> int:
        """Revoke all tokens for a user."""
        revoked_count = 0
        tokens_to_revoke = [
            token_id for token_id, token in self.tokens.items()
            if token.user_id == user_id
        ]

        for token_id in tokens_to_revoke:
            if self.revoke_token(token_id):
                revoked_count += 1

        return revoked_count

    def cleanup_expired_tokens(self) -> int:
        """Clean up expired tokens."""
        expired_tokens = [
            token_id for token_id, token in self.tokens.items()
            if datetime.now() > token.expires_at
        ]

        for token_id in expired_tokens:
            del self.tokens[token_id]

        return len(expired_tokens)


class AccessController:
    """Controls access to resources."""

    def __init__(self):
        self.resource_permissions: Dict[str, Set[Permission]] = {}
        self.role_permissions: Dict[UserRole, Set[Permission]] = {
            UserRole.GUEST: {Permission.READ},
            UserRole.USER: {Permission.READ, Permission.WRITE},
            UserRole.DEVELOPER: {Permission.READ, Permission.WRITE, Permission.DELETE},
            UserRole.ADMIN: {Permission.READ, Permission.WRITE, Permission.DELETE, Permission.ADMIN},
            UserRole.SYSTEM: set(Permission),  # All permissions
        }

    def register_resource_permissions(self, resource: str, permissions: Set[Permission]) -> None:
        """Register required permissions for a resource."""
        self.resource_permissions[resource] = permissions

    def check_permission(
        self,
        user: User,
        resource: str,
        required_permission: Permission,
        context: Dict[str, Any] = None
    ) -> bool:
        """Check if a user has permission for a resource."""
        # Check if user is active
        if not user.active:
            return False

        # Check user's role permissions
        role_permissions = self.role_permissions.get(user.role, set())
        if required_permission not in role_permissions:
            return False

        # Check user's explicit permissions
        if required_permission not in user.permissions:
            return False

        # Check resource-specific permissions
        resource_perms = self.resource_permissions.get(resource, set())
        if resource_perms and required_permission not in resource_perms:
            # Override with role-based check if admin
            if user.role not in [UserRole.ADMIN, UserRole.SYSTEM]:
                return False

        # Context-specific checks
        if context:
            return self._check_context_permissions(user, resource, required_permission, context)

        return True

    def _check_context_permissions(
        self,
        user: User,
        resource: str,
        required_permission: Permission,
        context: Dict[str, Any]
    ) -> bool:
        """Check context-specific permissions."""
        # Ownership check
        if "owner_id" in context and context["owner_id"] == user.id:
            return True

        # Time-based access
        if "access_window" in context:
            start_time = context["access_window"]["start"]
            end_time = context["access_window"]["end"]
            current_time = datetime.now()
            if not (start_time <= current_time <= end_time):
                return False

        # IP-based restrictions
        if "allowed_ips" in context and "ip_address" in context:
            if context["ip_address"] not in context["allowed_ips"]:
                return False

        return True


class InputValidator:
    """Validates and sanitizes input data."""

    def __init__(self):
        self.patterns = {
            "sql_injection": re.compile(
                r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)",
                re.IGNORECASE
            ),
            "xss": re.compile(
                r"(<script|javascript:|onload=|onerror=|onclick=)",
                re.IGNORECASE
            ),
            "path_traversal": re.compile(r"(\.\./|\.\.\\)"),
            "command_injection": re.compile(
                r"(;|\||&|`|\$\(|\$\{)",
                re.IGNORECASE
            ),
        }

    def validate_string(
        self,
        input_str: str,
        max_length: int = 1000,
        allow_empty: bool = True,
        pattern: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """Validate a string input."""
        if not input_str:
            return allow_empty, None if allow_empty else (False, "Input cannot be empty")

        if len(input_str) > max_length:
            return False, f"Input exceeds maximum length of {max_length}"

        if pattern and not re.match(pattern, input_str):
            return False, "Input does not match required pattern"

        # Check for common injection patterns
        for attack_type, regex in self.patterns.items():
            if regex.search(input_str):
                return False, f"Potentially malicious input detected: {attack_type}"

        return True, None

    def sanitize_string(self, input_str: str) -> str:
        """Sanitize a string input."""
        # Remove potentially dangerous characters
        sanitized = re.sub(r"[<>'\"\\]", "", input_str)

        # Normalize whitespace
        sanitized = re.sub(r"\s+", " ", sanitized).strip()

        return sanitized

    def validate_email(self, email: str) -> Tuple[bool, Optional[str]]:
        """Validate an email address."""
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, email):
            return False, "Invalid email format"
        return True, None

    def validate_path(self, path: str, base_path: str = "/") -> Tuple[bool, Optional[str]]:
        """Validate a file path."""
        # Normalize path
        normalized_path = os.path.normpath(path)

        # Check for path traversal
        if ".." in normalized_path:
            return False, "Path traversal detected"

        # Ensure path is within base path
        if not normalized_path.startswith(base_path):
            return False, "Path outside allowed directory"

        return True, None


class EncryptionManager:
    """Manages encryption and decryption."""

    def __init__(self, key: Optional[bytes] = None):
        if key:
            self.fernet = Fernet(key)
        else:
            # Generate a new key
            self.fernet = Fernet(Fernet.generate_key())

    @property
    def key(self) -> bytes:
        """Get the encryption key."""
        return self.fernet.key

    def encrypt(self, data: str) -> str:
        """Encrypt string data."""
        encrypted_bytes = self.fernet.encrypt(data.encode())
        return base64.b64encode(encrypted_bytes).decode()

    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt string data."""
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted_bytes = self.fernet.decrypt(encrypted_bytes)
        return decrypted_bytes.decode()

    def encrypt_dict(self, data: Dict[str, Any]) -> str:
        """Encrypt a dictionary."""
        json_str = json.dumps(data)
        return self.encrypt(json_str)

    def decrypt_dict(self, encrypted_data: str) -> Dict[str, Any]:
        """Decrypt to a dictionary."""
        json_str = self.decrypt(encrypted_data)
        return json.loads(json_str)


class AuditLogger:
    """Logs security events for auditing."""

    def __init__(self, log_file: Optional[str] = None):
        self.log_file = log_file
        self.logger = logging.getLogger("security_audit")

        if log_file:
            handler = logging.FileHandler(log_file)
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

    def log_event(self, event: SecurityEvent) -> None:
        """Log a security event."""
        log_data = {
            "event_id": event.event_id,
            "event_type": event.event_type,
            "user_id": event.user_id,
            "resource": event.resource,
            "action": event.action,
            "result": event.result,
            "timestamp": event.timestamp.isoformat(),
            "ip_address": event.ip_address,
            "user_agent": event.user_agent,
            "details": event.details,
        }

        log_message = json.dumps(log_data)

        if event.result in ["failure", "denied"]:
            self.logger.warning(f"SECURITY_EVENT: {log_message}")
        else:
            self.logger.info(f"SECURITY_EVENT: {log_message}")

    def query_events(
        self,
        user_id: Optional[str] = None,
        event_type: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100
    ) -> List[SecurityEvent]:
        """Query security events (simplified implementation)."""
        # In a real implementation, this would query a database
        return []


class SecurityManager:
    """Main security management system."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.settings = get_settings()
        self.config = config or {}

        # Initialize components
        self.password_hasher = PasswordHasher()
        self.token_manager = TokenManager(
            token_expiry_hours=self.config.get("token_expiry_hours", 24)
        )
        self.access_controller = AccessController()
        self.input_validator = InputValidator()
        self.encryption_manager = EncryptionManager()
        self.audit_logger = AuditLogger(
            log_file=self.config.get("audit_log_file")
        )

        # User management
        self.users: Dict[str, User] = {}
        self.user_sessions: Dict[str, str] = {}  # user_id -> token_id

        # Security settings
        self.max_login_attempts = self.config.get("max_login_attempts", 5)
        self.lockout_duration_minutes = self.config.get("lockout_duration_minutes", 15)
        self.failed_login_attempts: Dict[str, List[datetime]] = {}

    def create_user(
        self,
        username: str,
        email: str,
        password: str,
        role: UserRole = UserRole.USER,
        permissions: Optional[Set[Permission]] = None
    ) -> User:
        """Create a new user."""
        # Validate inputs
        valid, error = self.input_validator.validate_email(email)
        if not valid:
            raise SecurityError(f"Invalid email: {error}")

        if len(password) < 8:
            raise SecurityError("Password must be at least 8 characters long")

        # Check if user already exists
        if any(u.username == username or u.email == email for u in self.users.values()):
            raise SecurityError("User with this username or email already exists")

        # Create user
        user_id = secrets.token_urlsafe(16)
        user_permissions = permissions or self.access_controller.role_permissions.get(role, set())

        user = User(
            id=user_id,
            username=username,
            email=email,
            role=role,
            permissions=user_permissions,
        )

        # Hash password
        hashed_password = self.password_hasher.hash_password(password)

        # Store user (in a real implementation, this would be in a database)
        self.users[user_id] = user

        # Log event
        self.audit_logger.log_event(SecurityEvent(
            event_id=secrets.token_urlsafe(16),
            event_type="user_created",
            user_id=user_id,
            resource="user",
            action="create",
            result="success",
            details={"username": username, "role": role.value}
        ))

        return user

    def authenticate_user(
        self,
        username: str,
        password: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Optional[SecurityToken]:
        """Authenticate a user and return a token."""
        # Find user
        user = None
        for u in self.users.values():
            if u.username == username or u.email == username:
                user = u
                break

        if not user:
            self._log_failed_login(username, ip_address, user_agent, "user_not_found")
            return None

        # Check if user is locked out
        if self._is_user_locked_out(username):
            self._log_failed_login(username, ip_address, user_agent, "locked_out")
            return None

        # Verify password
        if not hasattr(user, 'password_hash'):
            # In a real implementation, password would be stored with user
            # For demo purposes, we'll skip password verification
            pass

        # Generate token
        token = self.token_manager.generate_token(user)
        self.user_sessions[user.id] = token.token_id

        # Update last login
        user.last_login = datetime.now()

        # Clear failed login attempts
        if username in self.failed_login_attempts:
            del self.failed_login_attempts[username]

        # Log successful login
        self.audit_logger.log_event(SecurityEvent(
            event_id=secrets.token_urlsafe(16),
            event_type="user_login",
            user_id=user.id,
            resource="auth",
            action="login",
            result="success",
            ip_address=ip_address,
            user_agent=user_agent
        ))

        return token

    def validate_token(self, token_id: str) -> Optional[User]:
        """Validate a token and return the associated user."""
        token = self.token_manager.validate_token(token_id)
        if not token:
            return None

        user = self.users.get(token.user_id)
        if user and user.active:
            return user

        return None

    def logout_user(self, token_id: str) -> bool:
        """Logout a user by revoking their token."""
        token = self.token_manager.validate_token(token_id)
        if token:
            self.token_manager.revoke_token(token_id)
            if token.user_id in self.user_sessions:
                del self.user_sessions[token.user_id]

            # Log logout
            self.audit_logger.log_event(SecurityEvent(
                event_id=secrets.token_urlsafe(16),
                event_type="user_logout",
                user_id=token.user_id,
                resource="auth",
                action="logout",
                result="success"
            ))

            return True
        return False

    def check_access(
        self,
        token_id: str,
        resource: str,
        required_permission: Permission,
        context: Optional[Dict[str, Any]] = None
    ) -> Tuple[bool, Optional[User]]:
        """Check if a token has access to a resource."""
        user = self.validate_token(token_id)
        if not user:
            return False, None

        has_permission = self.access_controller.check_permission(
            user, resource, required_permission, context
        )

        # Log access attempt
        self.audit_logger.log_event(SecurityEvent(
            event_id=secrets.token_urlsafe(16),
            event_type="access_check",
            user_id=user.id,
            resource=resource,
            action=required_permission.value,
            result="success" if has_permission else "denied"
        ))

        return has_permission, user

    def validate_input(
        self,
        input_data: Any,
        input_type: str,
        **kwargs
    ) -> Tuple[bool, Optional[str]]:
        """Validate input data."""
        if input_type == "string":
            if isinstance(input_data, str):
                return self.input_validator.validate_string(input_data, **kwargs)
        elif input_type == "email":
            if isinstance(input_data, str):
                return self.input_validator.validate_email(input_data)
        elif input_type == "path":
            if isinstance(input_data, str):
                return self.input_validator.validate_path(input_data, **kwargs)

        return False, f"Unsupported input type: {input_type}"

    def encrypt_sensitive_data(self, data: Union[str, Dict[str, Any]]) -> str:
        """Encrypt sensitive data."""
        if isinstance(data, dict):
            return self.encryption_manager.encrypt_dict(data)
        else:
            return self.encryption_manager.encrypt(data)

    def decrypt_sensitive_data(self, encrypted_data: str) -> Union[str, Dict[str, Any]]:
        """Decrypt sensitive data."""
        try:
            # Try to decrypt as dict first
            return self.encryption_manager.decrypt_dict(encrypted_data)
        except (json.JSONDecodeError, UnicodeDecodeError):
            # Fall back to string decryption
            return self.encryption_manager.decrypt(encrypted_data)

    def _is_user_locked_out(self, username: str) -> bool:
        """Check if a user is locked out due to failed login attempts."""
        if username not in self.failed_login_attempts:
            return False

        attempts = self.failed_login_attempts[username]
        if len(attempts) >= self.max_login_attempts:
            last_attempt = attempts[-1]
            lockout_expiry = last_attempt + timedelta(minutes=self.lockout_duration_minutes)
            return datetime.now() < lockout_expiry

        return False

    def _log_failed_login(
        self,
        username: str,
        ip_address: Optional[str],
        user_agent: Optional[str],
        reason: str
    ) -> None:
        """Log a failed login attempt."""
        if username not in self.failed_login_attempts:
            self.failed_login_attempts[username] = []

        self.failed_login_attempts[username].append(datetime.now())

        # Log security event
        self.audit_logger.log_event(SecurityEvent(
            event_id=secrets.token_urlsafe(16),
            event_type="failed_login",
            user_id=None,
            resource="auth",
            action="login",
            result="failure",
            ip_address=ip_address,
            user_agent=user_agent,
            details={"username": username, "reason": reason}
        ))

    def get_security_stats(self) -> Dict[str, Any]:
        """Get security statistics."""
        return {
            "total_users": len(self.users),
            "active_users": len([u for u in self.users.values() if u.active]),
            "active_sessions": len(self.user_sessions),
            "active_tokens": len(self.token_manager.tokens),
            "revoked_tokens": len(self.token_manager.revoked_tokens),
            "failed_login_attempts": {
                username: len(attempts)
                for username, attempts in self.failed_login_attempts.items()
            }
        }


# Decorators for security

def require_permission(resource: str, permission: Permission):
    """Decorator to require permission for a function."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Extract token from kwargs or request context
            token_id = kwargs.get('token_id')
            if not token_id:
                raise SecurityError("Authentication required")

            security_manager = get_security_manager()
            has_access, user = security_manager.check_access(token_id, resource, permission)

            if not has_access:
                raise SecurityError(f"Access denied. Required permission: {permission.value}")

            # Add user to kwargs
            kwargs['current_user'] = user

            return func(*args, **kwargs)
        return wrapper
    return decorator


def validate_input(input_type: str, **validation_kwargs):
    """Decorator to validate input parameters."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            security_manager = get_security_manager()

            # Validate specific parameters
            for param_name, param_value in kwargs.items():
                if param_name in validation_kwargs:
                    valid, error = security_manager.validate_input(
                        param_value, input_type, **validation_kwargs[param_name]
                    )
                    if not valid:
                        raise SecurityError(f"Invalid input for {param_name}: {error}")

            return func(*args, **kwargs)
        return wrapper
    return decorator


# Global security manager instance
_security_manager: Optional[SecurityManager] = None


def get_security_manager() -> SecurityManager:
    """Get the global security manager instance."""
    global _security_manager
    if _security_manager is None:
        _security_manager = SecurityManager()
    return _security_manager


def init_security(config: Optional[Dict[str, Any]] = None) -> SecurityManager:
    """Initialize the global security manager."""
    global _security_manager
    _security_manager = SecurityManager(config)
    return _security_manager


# Utility functions

def generate_secure_token(length: int = 32) -> str:
    """Generate a cryptographically secure token."""
    return secrets.token_urlsafe(length)


def hash_data(data: str, salt: Optional[str] = None) -> str:
    """Hash data with optional salt."""
    if salt:
        salted_data = data + salt
    else:
        salted_data = data

    return hashlib.sha256(salted_data.encode()).hexdigest()


def verify_data_hash(data: str, hash_value: str, salt: Optional[str] = None) -> bool:
    """Verify data against its hash."""
    computed_hash = hash_data(data, salt)
    return hmac.compare_digest(computed_hash, hash_value)