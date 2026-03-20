@echo off
echo 🧪 Ollama WebNovel Engine v4 - API Test Script
echo =============================================

echo.
echo 1. Testing Health Check...
curl -s http://localhost:3000/health | jq
if %errorlevel% neq 0 (
    echo ❌ Health check failed
    exit /b 1
)

echo.
echo 2. Testing Novel Initialization...
curl -s -X POST http://localhost:3000/novel/init ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Novel\",\"theme\":\"Testing the engine\",\"genre\":\"Sci-Fi\",\"tone\":\"Mysterious\",\"worldRules\":\"Technology advanced but society regressed\",\"mainCharacter\":\"Alex, a tech researcher\",\"sideCharacters\":[\"Dr. Chen\"],\"totalChapters\":10}" | jq

echo.
echo 3. Testing Get All Novels...
curl -s http://localhost:3000/novels | jq

echo.
echo 🎉 API tests completed!
echo.
echo To generate a chapter, use:
echo curl -X POST http://localhost:3000/novel/NOVEL_ID/generate/1