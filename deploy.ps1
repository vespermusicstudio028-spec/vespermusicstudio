# -----------------------------------------------------------------------------
# VESPER MUSIC STUDIO - SCRIPT DE DEPLOY E SINCRONIZACAO AUTOMATICA
# -----------------------------------------------------------------------------

# Forcar o console a usar codificacao UTF-8 para exibir acentos corretamente
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host

# Arte Cabecalho
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "      __      __                                 __  __                  " -ForegroundColor Cyan
Write-Host "      \ \    / /___  ___ _ __   ___ _ __         |  \/  | _  _ ___ _ __  " -ForegroundColor Cyan
Write-Host "       \ \  / / _ \/ __| '_ \ / _ \ '__|  ______ | |\/| | || (_-< / _|() " -ForegroundColor Cyan
Write-Host "        \ \/ /  __/\__ \ |_) |  __/ |    |______||_|  |_|\_,_/__/_\__|   " -ForegroundColor Cyan
Write-Host "         \/   \___||___/ .__/ \___|_|                                    " -ForegroundColor Cyan
Write-Host "                       |_|                                               " -ForegroundColor Cyan
Write-Host "                 DEPLOY AUTOMATICO - GITHUB & VERCEL                     " -ForegroundColor Yellow
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host ""

# Funcao para exibir mensagens com cores consistentes (usando tags seguras em ASCII)
function Show-Step ($msg, $status = "INFO") {
    switch ($status) {
        "SUCCESS" { Write-Host "  [OK] $msg" -ForegroundColor Green }
        "ERROR"   { Write-Host "  [ERRO] $msg" -ForegroundColor Red }
        "WARNING" { Write-Host "  [AVISO] $msg" -ForegroundColor Yellow }
        default   { Write-Host "  [INFO] $msg" -ForegroundColor Cyan }
    }
}

# --- 1. VERIFICAR DEPENDENCIAS DO SISTEMA ---
Show-Step "Verificando dependencias do sistema..."
$gitCheck = Get-Command git -ErrorAction SilentlyContinue
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue

if (-not $gitCheck) {
    Show-Step "Git nao esta instalado ou nao esta no PATH do Windows!" "ERROR"
    Write-Host "Por favor, instale o Git antes de continuar." -ForegroundColor Red
    Write-Host "Pressione qualquer tecla para sair..."
    $null = [Console]::ReadKey($true)
    Exit 1
}

if (-not $nodeCheck) {
    Show-Step "Node.js nao esta instalado ou nao esta no PATH!" "ERROR"
    Write-Host "Por favor, instale o Node.js antes de continuar." -ForegroundColor Red
    Write-Host "Pressione qualquer tecla para sair..."
    $null = [Console]::ReadKey($true)
    Exit 1
}
Show-Step "Dependencias (Git e Node.js) verificadas com sucesso." "SUCCESS"
Write-Host ""

# --- 2. VERIFICAR ALTERACOES DO GIT ---
Show-Step "Analisando estado atual do Git..."
$gitStatus = git status --porcelain

if ([string]::IsNullOrEmpty($gitStatus)) {
    Show-Step "Nenhuma alteracao detectada nos arquivos locais." "WARNING"
    Write-Host ""
    $confirmDeploy = Read-Host "Deseja forcar o deploy na Vercel mesmo assim? (S/N)"
    if ($confirmDeploy -notmatch "^[sS]") {
        Show-Step "Operacao cancelada pelo usuario." "WARNING"
        Write-Host ""
        Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
        $null = [Console]::ReadKey($true)
        Exit 0
    }
} else {
    Show-Step "Alteracoes locais encontradas!" "SUCCESS"
    
    # Mostrar breve resumo das alteracoes
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    git status -s | Out-String | Write-Host -ForegroundColor DarkYellow
    Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
    Write-Host ""
    
    # Definir mensagem de commit padrao
    $defaultMsg = "Ajustes e atualizacoes automaticas - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
    
    Write-Host "Digite a mensagem do commit para salvar no GitHub:" -ForegroundColor Yellow
    Write-Host "(Ou pressione [ENTER] para usar: '$defaultMsg')" -ForegroundColor Gray
    $commitMsg = Read-Host "Mensagem"
    
    if ([string]::IsNullOrEmpty($commitMsg)) {
        $commitMsg = $defaultMsg
    }
    
    # Executar Git Add e Commit
    Show-Step "Adicionando modificacoes..."
    git add .
    if ($LASTEXITCODE -eq 0) {
        Show-Step "Arquivos preparados com sucesso!" "SUCCESS"
    } else {
        Show-Step "Falha ao preparar arquivos no Git." "ERROR"
        Write-Host "Pressione qualquer tecla para sair..."
        $null = [Console]::ReadKey($true)
        Exit 1
    }
    
    Show-Step "Realizando commit: `"$commitMsg`"..."
    git commit -m "$commitMsg"
    if ($LASTEXITCODE -eq 0) {
        Show-Step "Commit criado com sucesso!" "SUCCESS"
    } else {
        Show-Step "Falha ao realizar commit no Git." "ERROR"
        Write-Host "Pressione qualquer tecla para sair..."
        $null = [Console]::ReadKey($true)
        Exit 1
    }
}

# --- 3. PUSH PARA GITHUB ---
Show-Step "Enviando atualizacoes para o GitHub..."
git push origin main

# Fallback se falhar
if ($LASTEXITCODE -ne 0) {
    Show-Step "Falha ao enviar para origin main. Tentando git push padrao..." "WARNING"
    git push
    if ($LASTEXITCODE -ne 0) {
        Show-Step "Erro ao enviar para o GitHub. Verifique sua conexao e credenciais." "ERROR"
        Write-Host "Pressione qualquer tecla para sair..."
        $null = [Console]::ReadKey($true)
        Exit 1
    }
}
Show-Step "GitHub atualizado com sucesso!" "SUCCESS"
Write-Host ""

# --- 4. DEPLOY NA VERCEL ---
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "              INICIANDO DEPLOY DE PRODUCAO NA VERCEL                      " -ForegroundColor Yellow
Write-Host "==========================================================================" -ForegroundColor Cyan
Show-Step "Executando o comando de deploy na Vercel..."

# Executa o npx vercel --prod
npx vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Show-Step "Deploy na Vercel concluido e publicado com sucesso!" "SUCCESS"
    Show-Step "Seu site esta atualizado em: https://vespermusicstudio.vercel.app" "SUCCESS"
} else {
    Write-Host ""
    Show-Step "Houve um problema durante o deploy na Vercel. Verifique os logs acima." "ERROR"
}

Write-Host ""
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "              PROCESSO DE ATUALIZACAO CONCLUIDO!                         " -ForegroundColor Green
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = [Console]::ReadKey($true)
