# 🎨 PWA Icons - Profe PJ

O projeto usa o **logo.svg** oficial como base para gerar todos os ícones necessários para o PWA.

## ✅ Ícones Necessários

1. **icon-192x192.png** - Ícone principal (192x192 pixels)
2. **icon-512x512.png** - Ícone alta resolução (512x512 pixels)
3. **badge-72x72.png** - Badge para notificações (72x72 pixels)

## 🚀 Como Gerar os Ícones

### Opção 1: Script Automatizado (Recomendado)

```bash
# 1. Instale a dependência sharp
npm install --save-dev sharp

# 2. Execute o script
npm run generate:icons
```

Os ícones serão gerados automaticamente em `/public/`.

### Opção 2: Gerador Web (Sem instalação)

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse no navegador:
```
http://localhost:9002/icon-generator.html
```

3. Clique nos botões de download para cada tamanho
4. Salve os arquivos na pasta `/public/`

### Opção 3: Ferramenta Online

Se preferir usar uma ferramenta externa:
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- Faça upload do `logo.svg`
- Baixe os ícones gerados

## 📋 Especificações

- **Formato**: PNG
- **Fundo**: #8c52ff (roxo do logo)
- **Conteúdo**: Logo "Profe" oficial
- **Qualidade**: Alta resolução, sem perda

## ✨ Logo Oficial

O logo está localizado em `/public/logo.svg` e possui:
- Fundo roxo (#8c52ff)
- Texto "Profe" em branco e amarelo
- Design profissional e moderno
- Formato vetorial (escala sem perda de qualidade)

## 🔍 Verificação

Após gerar os ícones, verifique se os seguintes arquivos existem:

- [ ] `/public/icon-192x192.png`
- [ ] `/public/icon-512x512.png`
- [ ] `/public/badge-72x72.png`

## 🎯 Uso no PWA

Os ícones são automaticamente referenciados no `manifest.json` e serão usados:
- Na tela inicial do dispositivo após instalação
- Como ícone do app na lista de aplicativos
- Em notificações (badge)
- Na splash screen de carregamento

---

**Status**: ✅ Logo oficial disponível em `/public/logo.svg`
