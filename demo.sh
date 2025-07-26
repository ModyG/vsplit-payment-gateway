#!/bin/bash

# VSplit Demo Manager
# Run this script from the root of the VSplit repository

set -e

echo "🚀 VSplit Demo Manager"
echo "======================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "demo/vsplit-demo" ]; then
    echo "❌ Please run this script from the root of the VSplit repository"
    exit 1
fi

# Function to check if dependencies are installed
check_dependencies() {
    if [ ! -d "demo/vsplit-demo/node_modules" ]; then
        echo "📦 Installing demo dependencies..."
        cd demo/vsplit-demo && npm install && cd ../..
    fi
}

# Function to check environment variables
check_env() {
    if [ ! -f "demo/vsplit-demo/.env.local" ]; then
        echo "⚠️  Environment file not found. Creating from template..."
        cp demo/vsplit-demo/.env.example demo/vsplit-demo/.env.local
        echo "📝 Please edit demo/vsplit-demo/.env.local and add your Stripe keys"
        echo "   Then run this script again"
        exit 1
    fi
}

# Function to start demo
start_demo() {
    echo "🎬 Starting VSplit demo..."
    echo "📍 Demo will be available at: http://localhost:3000"
    echo "⏹️  Press Ctrl+C to stop"
    echo ""
    cd demo/vsplit-demo && npm run dev
}

# Function to build demo
build_demo() {
    echo "🔨 Building demo for production..."
    cd demo/vsplit-demo && npm run build
    echo "✅ Demo built successfully!"
    echo "📁 Files are in demo/vsplit-demo/out/"
}

# Function to show help
show_help() {
    echo "Usage: ./demo.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start    Start the demo development server (default)"
    echo "  build    Build the demo for production"
    echo "  setup    Setup environment and dependencies"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./demo.sh           # Start demo"
    echo "  ./demo.sh start     # Start demo"
    echo "  ./demo.sh build     # Build for production"
    echo "  ./demo.sh setup     # Setup only"
}

# Main logic
case "${1:-start}" in
    start)
        check_dependencies
        check_env
        start_demo
        ;;
    build)
        check_dependencies
        check_env
        build_demo
        ;;
    setup)
        check_dependencies
        check_env
        echo "✅ Setup complete! Run './demo.sh start' to launch the demo"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
