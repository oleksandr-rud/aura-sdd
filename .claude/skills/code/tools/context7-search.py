#!/usr/bin/env python3
"""
Context7 Search Integration for Code Development

This script provides intelligent code search capabilities using Context7 integration
for pattern discovery, documentation retrieval, and cross-project learning.
"""

import json
import sys
import re
import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from pathlib import Path

@dataclass
class CodePattern:
    """Data class for code pattern information."""
    pattern_id: str
    language: str
    framework: str
    pattern_type: str
    description: str
    code_example: str
    usage_context: str
    related_patterns: List[str]
    quality_score: float

@dataclass
class SearchResult:
    """Data class for search results."""
    query: str
    matches: List[CodePattern]
    documentation_refs: List[str]
    similar_implementations: List[str]
    confidence_score: float
    recommendations: List[str]

class Context7CodeSearch:
    def __init__(self):
        self.patterns_database = []
        self.memory_cache = {}
        self.documentation_index = {}
        self.usage_history = []

    def search_code_patterns(self, query: str, language: str = None, framework: str = None) -> SearchResult:
        """Search for code patterns using Context7 integration."""
        # Simulate Context7 API call (in practice, this would use the actual Context7 MCP)
        print(f"Searching Context7 for: '{query}' (Language: {language}, Framework: {framework})")

        # Simulate pattern matching
        matches = self._find_matching_patterns(query, language, framework)
        documentation_refs = self._find_documentation_references(query)
        similar_implementations = self._find_similar_implementations(query, language)
        confidence_score = self._calculate_confidence_score(matches, query)
        recommendations = self._generate_recommendations(matches, query)

        return SearchResult(
            query=query,
            matches=matches,
            documentation_refs=documentation_refs,
            similar_implementations=similar_implementations,
            confidence_score=confidence_score,
            recommendations=recommendations
        )

    def _find_matching_patterns(self, query: str, language: str = None, framework: str = None) -> List[CodePattern]:
        """Find matching code patterns."""
        # Simulate pattern database search
        patterns = []

        # Common patterns for demonstration
        if "authentication" in query.lower():
            patterns.append(CodePattern(
                pattern_id="AUTH-001",
                language=language or "python",
                framework=framework or "django",
                pattern_type="authentication",
                description="JWT-based authentication with token refresh",
                code_example=self._get_auth_example(language or "python"),
                usage_context="User authentication and authorization",
                related_patterns=["AUTH-002", "SECURITY-001"],
                quality_score=0.95
            ))

        if "api" in query.lower() or "rest" in query.lower():
            patterns.append(CodePattern(
                pattern_id="API-001",
                language=language or "python",
                framework=framework or "fastapi",
                pattern_type="api",
                description="RESTful API with automatic documentation",
                code_example=self._get_api_example(language or "python"),
                usage_context="Backend API development",
                related_patterns=["API-002", "VALIDATION-001"],
                quality_score=0.92
            ))

        if "database" in query.lower() or "orm" in query.lower():
            patterns.append(CodePattern(
                pattern_id="DB-001",
                language=language or "python",
                framework=framework or "sqlalchemy",
                pattern_type="database",
                description="Database models with relationships and migrations",
                code_example=self._get_database_example(language or "python"),
                usage_context="Database modeling and operations",
                related_patterns=["DB-002", "MIGRATION-001"],
                quality_score=0.88
            ))

        return patterns

    def _get_auth_example(self, language: str) -> str:
        """Get authentication code example for specific language."""
        examples = {
            "python": '''
# JWT Authentication Example
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
''',
            "javascript": '''
// JWT Authentication Example
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const createToken = async (payload, expiresIn = '15m') => {
  return await sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = async (token) => {
  try {
    return await verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Middleware example
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
''',
            "java": '''
// JWT Authentication Example
import io.jsonwebtoken.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private String jwtSecret = "your-secret-key";
    private int jwtExpirationInMs = 3600000; // 1 hour

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException |
                 UnsupportedJwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
'''
        }
        return examples.get(language, examples["python"])

    def _get_api_example(self, language: str) -> str:
        """Get API development code example."""
        examples = {
            "python": '''
# FastAPI REST API Example
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="User Management API")

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    is_active: bool = True

# In-memory database (replace with actual database)
users_db = []
next_id = 1

@app.post("/users/", response_model=User)
async def create_user(user: User):
    global next_id
    user.id = next_id
    next_id += 1
    users_db.append(user.dict())
    return user

@app.get("/users/", response_model=List[User])
async def get_users():
    return users_db

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    user = next((user for user in users_db if user["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=User)
async def update_user(user_id: int, user: User):
    user_idx = next((i for i, u in enumerate(users_db) if u["id"] == user_id), None)
    if user_idx is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.id = user_id
    users_db[user_idx] = user.dict()
    return user

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    user_idx = next((i for i, u in enumerate(users_db) if u["id"] == user_id), None)
    if user_idx is None:
        raise HTTPException(status_code=404, detail="User not found")
    users_db.pop(user_idx)
    return {"message": "User deleted successfully"}
''',
            "javascript": '''
// Express.js REST API Example
const express = require('express');
const app = express();
app.use(express.json());

// In-memory database (replace with actual database)
let users = [];
let nextId = 1;

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST create user
app.post('/users', (req, res) => {
  const user = {
    id: nextId++,
    name: req.body.name,
    email: req.body.email,
    isActive: true,
    createdAt: new Date()
  };
  users.push(user);
  res.status(201).json(user);
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    id: parseInt(req.params.id),
    updatedAt: new Date()
  };
  res.json(users[userIndex]);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
'''
        }
        return examples.get(language, examples["python"])

    def _get_database_example(self, language: str) -> str:
        """Get database ORM code example."""
        examples = {
            "python": '''
# SQLAlchemy Database Models Example
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    orders = relationship("Order", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}')>"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Integer, nullable=False)
    status = Column(String(20), default="pending")

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

    def __repr__(self):
        return f"<Order(id={self.id}, user_id={self.user_id}, total={self.total_amount})>"

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")

# Database setup
engine = create_engine("sqlite:///./app.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
'''
        }
        return examples.get(language, examples["python"])

    def _find_documentation_references(self, query: str) -> List[str]:
        """Find relevant documentation references."""
        docs = []

        if "authentication" in query.lower():
            docs.extend([
                "https://jwt.io/introduction/",
                "https://fastapi.tiangolo.com/tutorial/security/",
                "https://owasp.org/www-project-Top-Ten/2017/A2_2017-Broken_Authentication"
            ])

        if "api" in query.lower():
            docs.extend([
                "https://restfulapi.net/",
                "https://fastapi.tiangolo.com/",
                "https://swagger.io/specification/"
            ])

        if "database" in query.lower():
            docs.extend([
                "https://docs.sqlalchemy.org/",
                "https://www.postgresql.org/docs/",
                "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
            ])

        return docs

    def _find_similar_implementations(self, query: str, language: str = None) -> List[str]:
        """Find similar implementations in the codebase."""
        implementations = []

        # Simulate finding similar files in the project
        if "authentication" in query.lower():
            implementations.extend([
                "src/auth/jwt_handler.py",
                "src/auth/middleware.py",
                "src/user/auth_service.py",
                "tests/test_auth.py"
            ])

        if "api" in query.lower():
            implementations.extend([
                "src/api/users.py",
                "src/api/orders.py",
                "src/api/auth.py",
                "tests/test_api.py"
            ])

        return implementations

    def _calculate_confidence_score(self, matches: List[CodePattern], query: str) -> float:
        """Calculate confidence score for search results."""
        if not matches:
            return 0.0

        # Simple scoring based on match quality
        total_score = sum(pattern.quality_score for pattern in matches)
        base_confidence = total_score / len(matches)

        # Boost for exact matches
        query_lower = query.lower()
        for pattern in matches:
            if any(word in pattern.description.lower() for word in query_lower.split()):
                base_confidence += 0.05

        return min(1.0, base_confidence)

    def _generate_recommendations(self, matches: List[CodePattern], query: str) -> List[str]:
        """Generate recommendations based on search results."""
        recommendations = []

        if not matches:
            recommendations.append("No exact patterns found. Consider refining your search query.")
            return recommendations

        recommendations.append(f"Found {len(matches)} relevant patterns for '{query}'.")

        # Add specific recommendations based on patterns
        for match in matches:
            if match.pattern_type == "authentication":
                recommendations.append("Consider implementing token refresh for better security.")
                recommendations.append("Add rate limiting to prevent brute force attacks.")

            elif match.pattern_type == "api":
                recommendations.append("Implement API versioning for future compatibility.")
                recommendations.append("Add comprehensive input validation and error handling.")

            elif match.pattern_type == "database":
                recommendations.append("Consider database indexing for query optimization.")
                recommendations.append("Implement proper transaction handling for data consistency.")

        return recommendations

    def learn_from_usage(self, query: str, selected_pattern: CodePattern):
        """Learn from usage patterns to improve future recommendations."""
        usage_record = {
            "query": query,
            "selected_pattern": selected_pattern.pattern_id,
            "timestamp": datetime.now().isoformat()
        }
        self.usage_history.append(usage_record)

        # Update pattern quality score based on usage
        for pattern in self.patterns_database:
            if pattern.pattern_id == selected_pattern.pattern_id:
                pattern.quality_score = min(1.0, pattern.quality_score + 0.01)
                break

    def generate_search_report(self, search_result: SearchResult) -> str:
        """Generate comprehensive search report."""
        report = []
        report.append("# Context7 Code Search Report")
        report.append(f"Query: '{search_result.query}'")
        report.append(f"Confidence Score: {search_result.confidence_score:.2f}")
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")

        # Matching Patterns
        if search_result.matches:
            report.append("## Matching Code Patterns")
            for i, pattern in enumerate(search_result.matches, 1):
                report.append(f"### {i}. {pattern.pattern_id} - {pattern.pattern_type}")
                report.append(f"**Language**: {pattern.language}")
                report.append(f"**Framework**: {pattern.framework}")
                report.append(f"**Description**: {pattern.description}")
                report.append(f"**Quality Score**: {pattern.quality_score:.2f}")
                report.append(f"**Usage Context**: {pattern.usage_context}")

                if pattern.related_patterns:
                    report.append(f"**Related Patterns**: {', '.join(pattern.related_patterns)}")

                report.append("```")
                report.append(pattern.code_example)
                report.append("```")
                report.append("")
        else:
            report.append("## No matching patterns found")
            report.append("Consider refining your search query or checking for alternative terms.")
            report.append("")

        # Documentation References
        if search_result.documentation_refs:
            report.append("## Documentation References")
            for doc in search_result.documentation_refs:
                report.append(f"- [{doc}]({doc})")
            report.append("")

        # Similar Implementations
        if search_result.similar_implementations:
            report.append("## Similar Implementations")
            for impl in search_result.similar_implementations:
                report.append(f"- `{impl}`")
            report.append("")

        # Recommendations
        if search_result.recommendations:
            report.append("## Recommendations")
            for rec in search_result.recommendations:
                report.append(f"- {rec}")
            report.append("")

        return "\n".join(report)

def main():
    import argparse
    from datetime import datetime

    parser = argparse.ArgumentParser(description="Context7 Code Search Integration")
    parser.add_argument("query", help="Search query for code patterns")
    parser.add_argument("--language", help="Target programming language")
    parser.add_argument("--framework", help="Target framework")
    parser.add_argument("--output", help="Output file for search report")
    parser.add_argument("--format", choices=["text", "json"], default="text", help="Output format")

    args = parser.parse_args()

    searcher = Context7CodeSearch()
    result = searcher.search_code_patterns(args.query, args.language, args.framework)

    if args.format == "json":
        report_data = {
            "query": result.query,
            "matches": [asdict(match) for match in result.matches],
            "documentation_refs": result.documentation_refs,
            "similar_implementations": result.similar_implementations,
            "confidence_score": result.confidence_score,
            "recommendations": result.recommendations,
            "generated_at": datetime.now().isoformat()
        }
        report = json.dumps(report_data, indent=2)
    else:
        report = searcher.generate_search_report(result)

    # Output report
    if args.output:
        with open(args.output, 'w') as file:
            file.write(report)
        print(f"Search report saved to {args.output}")
    else:
        print(report)

if __name__ == "__main__":
    main()