# 🎬 API Demo Script

*Live API demonstration showcasing real requests and responses*

---

## 🎭 **Demo Setup**

### **Environment Configuration**
```bash
# Terminal 1: Start the API server
cd apps/api
cp .env.example .env
# Update with your API keys
pnpm dev

# Terminal 2: Demo client setup
curl -X GET http://localhost:4000/health
# Expected: {"status":"ok","timestamp":"2024-10-19T...","uptime":...}
```

### **Demo Variables**
```bash
export API_BASE="http://localhost:4000"
export AUTH_TOKEN=""
export WORKSPACE_ID=""
export USER_ID=""
```

---

## 📱 **Story 1: Sarah's Sales Success - API Calls**

### **Scene 1: Authentication**
```bash
# User registration
curl -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@techcorp.com",
    "password": "SecurePassword123!",
    "name": "Sarah Chen",
    "companyName": "TechCorp"
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-123",
      "email": "sarah.chen@techcorp.com",
      "name": "Sarah Chen",
      "isEmailVerified": false
    },
    "message": "Registration successful. Please check your email for verification."
  }
}

# User login
curl -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@techcorp.com",
    "password": "SecurePassword123!"
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "user": { "id": "user-uuid-123", "name": "Sarah Chen" },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}

# Store tokens for demo
export AUTH_TOKEN="eyJhbGciOiJIUzI1NiIs..."
export USER_ID="user-uuid-123"
```

### **Scene 2: Workspace Creation**
```bash
# Create workspace
curl -X POST "$API_BASE/workspace/workspaces" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "name": "TechCorp Sales Team",
    "description": "Sales workspace for TechCorp team collaboration"
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "id": "workspace-uuid-456",
    "name": "TechCorp Sales Team",
    "description": "Sales workspace for TechCorp team collaboration",
    "ownerId": "user-uuid-123",
    "memberCount": 1,
    "createdAt": "2024-10-19T10:00:00Z"
  }
}

export WORKSPACE_ID="workspace-uuid-456"
```

### **Scene 3: CRM - Contact Creation**
```bash
# Create contact
curl -X POST "$API_BASE/crm/contacts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "name": "Michael Rodriguez",
    "email": "michael.rodriguez@innovatecorp.com",
    "phone": "+1-555-0123",
    "company": "InnovateCorp",
    "tags": ["hot-lead", "ceo", "manufacturing"],
    "notes": "Interested in AI integration for manufacturing. Meeting scheduled for Oct 25."
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "id": "contact-uuid-789",
    "name": "Michael Rodriguez",
    "email": "michael.rodriguez@innovatecorp.com",
    "company": "InnovateCorp",
    "tags": ["hot-lead", "ceo", "manufacturing"],
    "createdAt": "2024-10-19T10:15:00Z"
  }
}

# List contacts
curl -X GET "$API_BASE/crm/contacts?page=1&limit=5" \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Expected Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "contact-uuid-789",
        "name": "Michael Rodriguez",
        "company": "InnovateCorp",
        "email": "michael.rodriguez@innovatecorp.com",
        "tags": ["hot-lead", "ceo", "manufacturing"]
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  }
}
```

### **Scene 4: Content Generation - Presentation**
```bash
# Generate AI presentation
curl -X POST "$API_BASE/content/generate/presentation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "topic": "AI Integration Strategy for Manufacturing",
    "audience": "C-Suite Executives",
    "length": "medium",
    "style": "professional"
  }'

# Expected Response (after ~30 seconds):
{
  "success": true,
  "data": {
    "id": "content-uuid-101",
    "type": "presentation",
    "title": "AI Integration Strategy for Manufacturing",
    "status": "completed",
    "content": {
      "slides": [
        {
          "id": 1,
          "title": "Executive Summary",
          "content": "Transforming manufacturing operations through AI integration...",
          "speakerNotes": "Emphasize ROI and timeline"
        },
        {
          "id": 2,
          "title": "Current Manufacturing Challenges",
          "content": "Key pain points in traditional manufacturing...",
          "speakerNotes": "Focus on relatable challenges"
        }
        // ... 10 more slides
      ],
      "metadata": {
        "slideCount": 12,
        "estimatedDuration": "45 minutes",
        "readabilityScore": "A+",
        "aiConfidence": 94
      }
    },
    "generatedAt": "2024-10-19T10:20:00Z"
  }
}
```

### **Scene 5: AI Chat - Strategy Consultation**
```bash
# Create chat session
curl -X POST "$API_BASE/chat/sessions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "title": "InnovateCorp AI Strategy",
    "context": "Manufacturing client, 500 employees, exploring AI integration"
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "id": "session-uuid-202",
    "title": "InnovateCorp AI Strategy",
    "context": "Manufacturing client, 500 employees, exploring AI integration",
    "messageCount": 0,
    "createdAt": "2024-10-19T10:25:00Z"
  }
}

# Send message to AI
curl -X POST "$API_BASE/chat/sessions/session-uuid-202/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "content": "What AI solutions should I prioritize for a manufacturing company with limited technical resources?"
  }'

# Expected Response (after ~10 seconds):
{
  "success": true,
  "data": {
    "id": "message-uuid-303",
    "role": "assistant",
    "content": "Based on your client profile, I recommend prioritizing these AI solutions:\n\n1. **Predictive Maintenance** (Quick ROI)\n   - Reduces downtime by 30-50%\n   - Implementation time: 2-3 months\n   - Technical requirements: Minimal\n\n2. **Inventory Management Optimization**\n   - Reduces carrying costs by 20-30%\n   - Implementation time: 1-2 months\n   - Technical requirements: Basic sensors + software\n\n3. **Quality Control Automation**\n   - Improves defect detection by 40%\n   - Implementation time: 3-4 months\n   - Technical requirements: Cameras + basic ML\n\n**Implementation Timeline:** 3-6 months\n**Expected ROI:** 200-300% within first year\n\nWould you like me to elaborate on any of these solutions?",
    "model": "gpt-4",
    "tokensUsed": 250,
    "createdAt": "2024-10-19T10:26:00Z"
  }
}
```

### **Scene 6: Data Analysis**
```bash
# Analyze CRM data for insights
curl -X POST "$API_BASE/content/analyze/data" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "dataType": "crm",
    "analysisType": "insights",
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-10-19T00:00:00Z"
    },
    "filters": {
      "stage": ["proposal", "negotiation"],
      "value": ">50000"
    }
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "id": "analysis-uuid-404",
    "type": "crm_insights",
    "insights": [
      {
        "category": "Performance Metrics",
        "finding": "Closing rate increased 23% with AI-generated proposals",
        "impact": "High",
        "recommendation": "Continue using AI for proposal generation"
      },
      {
        "category": "Industry Analysis",
        "finding": "Manufacturing sector shows 40% higher conversion rate",
        "impact": "High",
        "recommendation": "Focus more on manufacturing clients"
      },
      {
        "category": "Sales Cycle",
        "finding": "Average deal cycle reduced from 60 to 45 days",
        "impact": "Medium",
        "recommendation": "Analyze factors contributing to faster cycles"
      }
    ],
    "metrics": {
      "totalDeals": 45,
      "averageValue": "$75,000",
      "conversionRate": "68%",
      "salesCycleDays": 45
    },
    "generatedAt": "2024-10-19T10:30:00Z"
  }
}
```

---

## 🎯 **Live Demo Commands**

### **Quick Demo Sequence**
```bash
# 1. Health check
curl -X GET "$API_BASE/health"

# 2. Root endpoint
curl -X GET "$API_BASE/"

# 3. User registration
curl -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo123!","name":"Demo User"}'

# 4. Login
curl -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Demo123!"}'

# 5. Create contact
curl -X POST "$API_BASE/crm/contacts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"John Doe","email":"john@example.com","company":"Acme Corp"}'

# 6. Generate presentation
curl -X POST "$API_BASE/content/generate/presentation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"topic":"AI Business Strategy","audience":"Executives","length":"short","style":"professional"}'
```

### **Error Handling Demo**
```bash
# Invalid authentication
curl -X GET "$API_BASE/auth/me" \
  -H "Authorization: Bearer invalid-token"

# Expected Response:
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}

# Validation error
curl -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123"}'

# Expected Response:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email address"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

---

## 📊 **Demo Data Preparation**

### **Sample Data Setup Script**
```bash
#!/bin/bash
# setup-demo-data.sh

# Variables
API_BASE="http://localhost:4000"
AUTH_TOKEN=""

# 1. Register demo user
echo "Creating demo user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@techcorp.com",
    "password": "DemoPassword123!",
    "name": "Sarah Chen",
    "companyName": "TechCorp"
  }')

echo "Register response: $REGISTER_RESPONSE"

# 2. Login and get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.chen@techcorp.com",
    "password": "DemoPassword123!"
  }')

AUTH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.tokens.accessToken')
echo "Auth token: $AUTH_TOKEN"

# 3. Create workspace
echo "Creating workspace..."
WORKSPACE_RESPONSE=$(curl -s -X POST "$API_BASE/workspace/workspaces" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "name": "TechCorp Sales Team",
    "description": "Sales workspace for TechCorp team"
  }')

WORKSPACE_ID=$(echo $WORKSPACE_RESPONSE | jq -r '.data.id')
echo "Workspace ID: $WORKSPACE_ID"

# 4. Create sample contacts
echo "Creating sample contacts..."
curl -s -X POST "$API_BASE/crm/contacts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "name": "Michael Rodriguez",
    "email": "michael.rodriguez@innovatecorp.com",
    "company": "InnovateCorp",
    "tags": ["hot-lead", "ceo"]
  }'

curl -s -X POST "$API_BASE/crm/contacts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "name": "Jennifer Liu",
    "email": "jennifer.liu@dataflow.com",
    "company": "DataFlow",
    "tags": ["prospect", "cto"]
  }'

echo "Demo data setup complete!"
```

---

## 🎬 **Presentation Tips**

### **Before the Demo**
1. **Verify API is running**: Check `/health` endpoint
2. **Prepare environment variables**: Have tokens ready
3. **Test key scenarios**: Ensure all demo calls work
4. **Prepare backup responses**: In case of API issues

### **During the Demo**
1. **Start with health check**: Show system is ready
2. **Use realistic data**: Makes demo more relatable
3. **Explain each call**: Describe what's happening
4. **Show responses**: Highlight key data returned
5. **Demonstrate errors**: Show robust error handling

### **Highlight Key Features**
- **Speed**: Show fast API responses
- **Type Safety**: Demonstrate validation
- **AI Integration**: Showcase intelligent responses
- **Cross-Module**: Show data flow between modules
- **Error Handling**: Display graceful error responses

### **Troubleshooting**
- **API not responding**: Check server status
- **Authentication issues**: Verify token validity
- **Generation delays**: AI responses take time
- **Validation errors**: Show proper error messages

---

*This demo script provides a complete, runnable demonstration of the AI Workspace API capabilities with real requests and responses.*