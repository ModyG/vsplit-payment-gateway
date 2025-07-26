@echo off
setlocal enabledelayedexpansion

echo 🚀 VSplit Demo Manager
echo ======================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the root of the VSplit repository
    exit /b 1
)

if not exist "demo\vsplit-demo" (
    echo ❌ Demo directory not found
    exit /b 1
)

REM Get command argument
set "command=%1"
if "%command%"=="" set "command=start"

REM Function to check dependencies
:check_dependencies
if not exist "demo\vsplit-demo\node_modules" (
    echo 📦 Installing demo dependencies...
    cd demo\vsplit-demo
    call npm install
    cd ..\..
)
goto :eof

REM Function to check environment
:check_env
if not exist "demo\vsplit-demo\.env.local" (
    echo ⚠️  Environment file not found. Creating from template...
    copy "demo\vsplit-demo\.env.example" "demo\vsplit-demo\.env.local" >nul
    echo 📝 Please edit demo\vsplit-demo\.env.local and add your Stripe keys
    echo    Then run this script again
    exit /b 1
)
goto :eof

REM Function to start demo
:start_demo
echo 🎬 Starting VSplit demo...
echo 📍 Demo will be available at: http://localhost:3000
echo ⏹️  Press Ctrl+C to stop
echo.
cd demo\vsplit-demo
call npm run dev
goto :eof

REM Function to build demo
:build_demo
echo 🔨 Building demo for production...
cd demo\vsplit-demo
call npm run build
cd ..\..
echo ✅ Demo built successfully!
echo 📁 Files are in demo\vsplit-demo\out\
goto :eof

REM Function to show help
:show_help
echo Usage: demo.bat [command]
echo.
echo Commands:
echo   start    Start the demo development server (default)
echo   build    Build the demo for production
echo   setup    Setup environment and dependencies
echo   help     Show this help message
echo.
echo Examples:
echo   demo.bat           # Start demo
echo   demo.bat start     # Start demo
echo   demo.bat build     # Build for production
echo   demo.bat setup     # Setup only
goto :eof

REM Main logic
if "%command%"=="start" (
    call :check_dependencies
    call :check_env
    call :start_demo
) else if "%command%"=="build" (
    call :check_dependencies
    call :check_env
    call :build_demo
) else if "%command%"=="setup" (
    call :check_dependencies
    call :check_env
    echo ✅ Setup complete! Run 'demo.bat start' to launch the demo
) else if "%command%"=="help" (
    call :show_help
) else if "%command%"=="--help" (
    call :show_help
) else if "%command%"=="-h" (
    call :show_help
) else (
    echo ❌ Unknown command: %command%
    echo.
    call :show_help
    exit /b 1
)
