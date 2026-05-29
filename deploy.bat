@echo off
chcp 65001 > nul
title Vesper Music Studio - Deployer

echo [INFO] Iniciando script de deploy via PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"

if %errorlevel% neq 0 (
    echo.
    echo ==========================================================
    echo [ERRO] Ocorreu um erro inesperado ao executar o script.
    echo ==========================================================
    pause
)
