#!/bin/bash

# Script de auxílio para deploy na Vercel
# Este script NÃO faz o deploy automaticamente
# Ele apenas verifica se tudo está configurado

echo "🚀 Verificação de Deploy - Profe PJ"
echo "===================================="
echo ""

# Verificar se .env.local existe
if [ -f .env.local ]; then
    echo "✅ .env.local encontrado"
else
    echo "❌ .env.local NÃO encontrado"
    echo "   Crie o arquivo .env.local com suas variáveis"
    echo "   Use .env.example como referência"
    exit 1
fi

# Verificar variáveis críticas
echo ""
echo "📋 Verificando variáveis essenciais..."

check_var() {
    if grep -q "^$1=" .env.local 2>/dev/null; then
        value=$(grep "^$1=" .env.local | cut -d '=' -f2)
        if [ ! -z "$value" ] && [ "$value" != "your_*" ]; then
            echo "✅ $1"
        else
            echo "❌ $1 (não configurada)"
            return 1
        fi
    else
        echo "❌ $1 (não encontrada)"
        return 1
    fi
}

errors=0

# Firebase (já configurado em src/firebase/config.ts - não precisa verificar)

# Stripe
check_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" || errors=$((errors+1))
check_var "STRIPE_SECRET_KEY" || errors=$((errors+1))
check_var "NEXT_PUBLIC_STRIPE_PRICE_ID" || errors=$((errors+1))

# Google AI
check_var "GOOGLE_GENAI_API_KEY" || errors=$((errors+1))

echo ""
if [ $errors -eq 0 ]; then
    echo "✅ Todas as variáveis essenciais configuradas!"
    echo ""
    echo "📝 Próximos passos para deploy na Vercel:"
    echo ""
    echo "1. Instale a CLI da Vercel (se ainda não tiver):"
    echo "   npm i -g vercel"
    echo ""
    echo "2. Faça login:"
    echo "   vercel login"
    echo ""
    echo "3. Deploy preview:"
    echo "   vercel"
    echo ""
    echo "4. Deploy produção:"
    echo "   vercel --prod"
    echo ""
    echo "5. Configure as variáveis de ambiente no Dashboard da Vercel"
    echo "   (copie de .env.local para Vercel)"
    echo ""
    echo "6. Configure o webhook do Stripe com a URL de produção"
    echo "   https://seu-dominio.vercel.app/api/stripe/webhook"
    echo ""
    echo "📚 Documentação completa em: docs/VERCEL_DEPLOY.md"
else
    echo "❌ Encontrados $errors erro(s) nas variáveis de ambiente"
    echo ""
    echo "Configure as variáveis faltantes em .env.local antes de fazer deploy"
    echo "Use .env.example como referência"
    exit 1
fi
