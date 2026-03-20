@echo off
echo 🚀 Starting Ollama WebNovel Engine v4...
echo ==========================================

echo.
echo Checking if Ollama is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama is not running. Please start Ollama first.
    echo Run: ollama serve
    pause
    exit /b 1
)

echo ✅ Ollama is running, starting WebNovel Engine...

echo.
echo Starting server on port 3000...
node server.js