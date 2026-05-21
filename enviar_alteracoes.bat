@echo off
:: Configura o terminal para UTF-8 (corrige acentuações no Windows)
chcp 65001 > nul
echo ===================================================
echo   VESPER MUSIC STUDIO - SINCRONIZADOR DE DEPLOY
echo ===================================================
echo.

:: 1. Verificar Git
git rev-parse --is-inside-work-tree >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Inicializando repositório Git...
    git init
    echo [INFO] Repositório Git inicializado.
)

:: Adicionar todos os arquivos alterados
echo [INFO] Adicionando alterações ao Git...
git add .

:: Pegar mensagem de commit personalizada ou usar padrão
set /p msg="Digite a mensagem do commit (Pressione Enter para usar 'Ajustes de logo e botao de adicionar musica'): "
if "%msg%"=="" set msg=Ajustes de logo e botao de adicionar musica

echo [INFO] Realizando commit: "%msg%"
git commit -m "%msg%"

:: Verificar se tem remote configurado
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Nenhum repositório do GitHub (remote origin) vinculado ainda.
    set /p remote_url="Se quiser enviar para o GitHub agora, cole a URL do seu repositório do GitHub aqui (ou pressione Enter para pular): "
    if not "%remote_url%"=="" (
        git remote add origin %remote_url%
        git branch -M main
        echo [INFO] Enviando para o GitHub...
        git push -u origin main
    )
) else (
    echo [INFO] Enviando atualizações para o GitHub...
    git push
)

:: 2. Deploy na Vercel
echo.
echo ===================================================
echo   INICIANDO DEPLOY NA VERCEL
echo ===================================================
echo.
where vercel >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Executando Deploy de Produção na Vercel...
    vercel --prod
) else (
    echo [AVISO] Vercel CLI não encontrado globalmente.
    echo Se quiser implantar na Vercel, certifique-se de instalar com: npm install -g vercel
)

echo.
echo ===================================================
echo   SINCRONIZAÇÃO E DEPLOY CONCLUÍDOS!
echo ===================================================
pause
