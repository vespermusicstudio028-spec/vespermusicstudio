@echo off
chcp 65001 > nul

echo ===================================================
echo   VESPER MUSIC STUDIO - SINCRONIZADOR DE DEPLOY
echo ===================================================
echo.

echo [INFO] Adicionando alteracoes ao Git...
git add .

set msg=Ajustes de logo e botao de adicionar musica
set /p msg="Digite a mensagem do commit (Pressione Enter para usar '%msg%'): "

echo [INFO] Realizando commit: "%msg%"
git commit -m "%msg%"

echo [INFO] Enviando atualizacoes para o GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo [INFO] Tentando git push padrao...
    git push
)

echo.
echo ===================================================
echo   INICIANDO DEPLOY NA VERCEL
echo ===================================================
echo.

echo [INFO] Executando Deploy de Producao na Vercel...
call npx vercel --prod

echo.
echo ===================================================
echo   SINCRONIZACAO E DEPLOY CONCLUIDOS!
echo ===================================================
pause
