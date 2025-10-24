#!/bin/bash

# AI Workspace Development Startup Script
# Starts all services in development mode

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')] $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20+ first."
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi

    print_success "Dependencies check passed"
}

# Install dependencies if needed
install_dependencies() {
    print_status "Installing dependencies..."

    # Install root dependencies
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        print_status "Installing root dependencies..."
        npm install
        print_success "Root dependencies installed"
    fi

    # Install API dependencies
    if [ ! -d "apps/chat-api/node_modules" ] || [ "apps/chat-api/package.json" -nt "apps/chat-api/node_modules" ]; then
        print_status "Installing API dependencies..."
        cd apps/chat-api
        npm install
        cd ../..
        print_success "API dependencies installed"
    fi

    # Install client dependencies
    if [ ! -d "apps/chat-app/node_modules" ] || [ "apps/chat-app/package.json" -nt "apps/chat-app/node_modules" ]; then
        print_status "Installing client dependencies..."
        cd apps/chat-app
        npm install
        cd ../..
        print_success "Client dependencies installed"
    fi
}

# Create environment files if they don't exist
setup_environment() {
    print_status "Setting up environment files..."

    # API environment file
    if [ ! -f "apps/chat-api/.env" ]; then
        print_status "Creating API environment file..."
        cp apps/chat-api/.env.example apps/chat-api/.env
        print_success "API environment file created from template"
    fi

    # Client environment file
    if [ ! -f "apps/chat-app/.env" ]; then
        print_status "Creating client environment file..."
        cp apps/chat-app/.env.example apps/chat-app/.env
        print_success "Client environment file created from template"
    fi

    # Root environment file
    if [ ! -f ".env" ]; then
        print_status "Creating root environment file..."
        cat > .env << 'EOF'
# AI Workspace Development Environment
NODE_ENV=development

# API Configuration
API_PORT=4000
API_HOST=0.0.0.0

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:4000

# JWT Configuration (for development only - change in production!)
JWT_SECRET=dev-jwt-secret-key-for-development-only
JWT_REFRESH_SECRET=dev-jwt-refresh-secret-for-development-only
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Service Configuration (optional for demo)
# OPENAI_API_KEY=your-openai-api-key
# CLAUDE_API_KEY=your-claude-api-key

# Email Configuration (optional for demo)
# RESEND_API_KEY=your-resend-api-key
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_FROM=noreply@yourapp.com

# Cache Configuration (optional)
# REDIS_URL=redis://localhost:6379
EOF
        print_success "Root environment file created"
    fi
}

# Start all services
start_services() {
    print_status "Starting development services..."

    # Kill any existing processes on ports 4000 and 5173
    lsof -ti:4000 2>/dev/null | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true

    # Start API server
    print_status "Starting API server..."
    cd apps/chat-api
    node src/simple-demo.js &
    API_PID=$!
    cd ../..
    echo "$API_PID" > .pid-api-server
    print_success "API server started (PID: $API_PID)"

    # Wait for API server to be ready
    print_status "Waiting for API server to be ready..."
    sleep 3

    # Check API health
    if curl -s http://localhost:4000/health > /dev/null; then
        print_success "API server is ready"
    else
        print_error "API server failed to start"
        return 1
    fi

    # Start client development server
    print_status "Starting client server..."
    cd apps/chat-app
    npm run dev &
    CLIENT_PID=$!
    cd ../..
    echo "$CLIENT_PID" > .pid-client-server
    print_success "Client server started (PID: $CLIENT_PID)"

    # Wait for client server to be ready
    print_status "Waiting for client server to be ready..."
    sleep 5

    # Check client health
    if curl -s http://localhost:5173/ > /dev/null; then
        print_success "Client server is ready"
    else
        print_warning "Client server may still be starting up"
    fi
}

# Display service URLs
show_urls() {
    print_status "Services are running!"
    echo
    echo -e "${GREEN}🚀 API Server:${NC}"
    echo -e "   Health Check: ${BLUE}http://localhost:4000/health${NC}"
    echo -e "   API Root:     ${BLUE}http://localhost:4000/${NC}"
    echo -e "   Demo Auth:   ${BLUE}http://localhost:4000/demo/auth/login${NC}"
    echo -e "   Demo Chat:   ${BLUE}http://localhost:4000/demo/chat/sessions${NC}"
    echo -e "   Demo CRM:    ${BLUE}http://localhost:4000/demo/crm/contacts${NC}"
    echo -e "   Demo Content: ${BLUE}http://localhost:4000/demo/content/generate/presentation${NC}"
    echo
    echo -e "${GREEN}⚛️  Client App:${NC}"
    echo -e "   URL:        ${BLUE}http://localhost:5173/${NC}"
    echo
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo -e "   • API responds to all demo endpoints with realistic data"
    echo -e "   • Client connects to API automatically"
    echo -e "   • All services are running in development mode"
    echo -e "   • Press Ctrl+C to stop all services"
    echo
}

# Stop all services
stop_services() {
    print_status "Stopping all services..."

    # Kill processes using PIDs
    if [ -f ".pid-api-server" ]; then
        api_pid=$(cat ".pid-api-server")
        if kill -0 "$api_pid" 2>/dev/null; then
            kill "$api_pid"
            print_success "API server stopped"
        fi
        rm -f ".pid-api-server"
    fi

    if [ -f ".pid-client-server" ]; then
        client_pid=$(cat ".pid-client-server")
        if kill -0 "$client_pid" 2>/dev/null; then
            kill "$client_pid"
            print_success "Client server stopped"
        fi
        rm -f ".pid-client-server"
    fi

    # Kill any remaining processes on the ports
    lsof -ti:4000 2>/dev/null | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true

    print_success "All services stopped"
}

# Handle script interruption
cleanup() {
    echo
    print_warning "Stopping all services..."
    stop_services
    print_success "Cleanup completed. Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo -e "${BLUE}🚀 AI Workspace Development Startup${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo

    case "${1:-start}" in
        "start")
            check_dependencies
            install_dependencies
            setup_environment
            start_services
            show_urls

            # Keep the script running
            print_status "All services are running. Press Ctrl+C to stop."
            while true; do
                sleep 1
            done
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            sleep 2
            main "start"
            ;;
        "status")
            echo -e "${BLUE}Service Status:${NC}"

            # Check API server
            if curl -s http://localhost:4000/health > /dev/null; then
                echo -e "   API Server: ${GREEN}Running${NC}"
            else
                echo -e "   API Server: ${RED}Stopped${NC}"
            fi

            # Check client server
            if curl -s http://localhost:5173/ > /dev/null; then
                echo -e "   Client App: ${GREEN}Running${NC}"
            else
                echo -e "   Client App: ${RED}Stopped${NC}"
            fi
            ;;
        "install")
            check_dependencies
            install_dependencies
            setup_environment
            print_success "Installation complete"
            ;;
        "help"|"-h"|"--help")
            echo "AI Workspace Development Script"
            echo
            echo "Usage: $0 [command]"
            echo
            echo "Commands:"
            echo "  start     Start all services in development mode (default)"
            echo "  stop      Stop all running services"
            echo "  restart   Restart all services"
            echo "  status    Check status of all services"
            echo "  install   Install all dependencies"
            echo "  help      Show this help message"
            echo
            echo "Examples:"
            echo "  $0                # Start all services"
            echo "  $0 start          # Start all services"
            echo "  $0 stop           # Stop all services"
            echo "  $0 restart        # Restart all services"
            echo "  $0 status         # Check service status"
            echo
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for available commands."
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"