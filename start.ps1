# GeoTrace Quick Start Script
# Run this script to start both frontend and backend

Write-Host "🌍 Starting GeoTrace Application..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Node.js version: $(node --version)" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

if (!(Test-Path "server/node_modules")) {
    Write-Host "📥 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# Check if .env files exist
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Frontend .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

if (!(Test-Path "server/.env")) {
    Write-Host "⚠️  Backend .env file not found. Creating from server/.env.example..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "⚠️  Please edit server/.env with your Supabase credentials!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Starting Backend Server (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

Start-Sleep -Seconds 3

Write-Host "🎨 Starting Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ GeoTrace is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Test Credentials:" -ForegroundColor Yellow
Write-Host "   Email: test@example.com" -ForegroundColor White
Write-Host "   Password: password123" -ForegroundColor White
Write-Host ""
Write-Host "📚 Don't forget to run the SQL script in Supabase!" -ForegroundColor Yellow
Write-Host "   File: supabase_setup.sql" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
