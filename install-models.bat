@echo off
echo 🤖 Installing required Ollama models for WebNovel Engine v4...
echo ===============================================================

echo.
echo Pulling Qwen2.5 7B (Quantized) - Primary Engine Brain...
ollama pull qwen2.5:7b-q4_k_m

echo.
echo Pulling Llama3 8B (Quantized) - Emotional Enhancer...
ollama pull llama3:8b-q4_k_m

echo.
echo 🎉 Model installation complete!
echo.
echo You can now start the WebNovel Engine with: npm start
echo.
pause