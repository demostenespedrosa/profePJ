# 📱 Guia PWA - Profe PJ

## ✅ O que foi implementado

### 1. **Manifest.json** (`/public/manifest.json`)
- Nome da aplicação
- Ícones para instalação
- Cores do tema
- Modo standalone (aparência de app nativo)

### 2. **Service Worker** (`/public/sw.js`)
- Cache de páginas principais
- Estratégia Network First
- Página offline
- Suporte para sincronização em background (futuro)
- Suporte para notificações push (futuro)

### 3. **Componentes React**
- **PWARegister**: Registra o service worker automaticamente
- **PWAInstallPrompt**: Banner de instalação amigável

### 4. **Página Offline** (`/public/offline.html`)
- Exibida quando não há conexão
- Design consistente com o app

## 🧪 Como Testar

### Desenvolvimento Local

1. **Build de produção** (PWA só funciona em produção):
```bash
npm run build
npm start
```

2. **Acesse**: http://localhost:3000

3. **Teste no Chrome DevTools**:
   - Abra DevTools (F12)
   - Vá em "Application" > "Service Workers"
   - Verifique se o SW está registrado
   - Teste offline: marque "Offline" e recarregue

### No Celular (Android/iOS)

#### Android (Chrome):
1. Acesse o app via HTTPS (necessário para PWA)
2. Chrome mostrará banner "Adicionar à tela inicial"
3. Ou: Menu ⋮ > "Instalar aplicativo"
4. Ícone aparecerá na tela inicial

#### iOS (Safari):
1. Acesse o app via Safari
2. Toque no botão de compartilhar 
3. Role até "Adicionar à Tela de Início"
4. Confirme

## 🎨 Próximos Passos

### 1. Criar Ícones
Você precisa criar ícones reais para o app:
- `icon-192x192.png`
- `icon-512x512.png`

**Ferramentas recomendadas:**
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [Figma](https://figma.com) ou Canva

**Especificações:**
- Fundo: #A076F9 (roxo do Profe PJ)
- Formato: PNG
- Conteúdo: Logo "PJ" ou símbolo de professor

### 2. Deploy HTTPS
PWA **requer HTTPS** em produção:
- Vercel (recomendado - HTTPS automático)
- Firebase Hosting
- Netlify

### 3. Funcionalidades Avançadas (Futuro)

#### Sincronização em Background
```javascript
// Quando o usuário criar uma aula offline
if ('sync' in navigator.serviceWorker) {
  await navigator.serviceWorker.ready;
  await registration.sync.register('sync-lessons');
}
```

#### Notificações Push
```javascript
// Pedir permissão
const permission = await Notification.requestPermission();
if (permission === 'granted') {
  // Configurar notificações via Firebase Cloud Messaging
}
```

## 🎨 Gerando Ícones

O projeto usa o **logo.svg** oficial. Você tem 3 opções para gerar os ícones:

### Opção 1: Script Automatizado
```bash
npm install --save-dev sharp
npm run generate:icons
```

### Opção 2: Gerador Web
1. Acesse: `http://localhost:9002/icon-generator.html`
2. Baixe os ícones (192x192, 512x512, 72x72)
3. Salve em `/public/`

### Opção 3: Manual
Use o `logo.svg` em qualquer ferramenta de edição de imagem.

## 🔧 Configurações Importantes

### Manifest (já configurado)
- ✅ `display: "standalone"` - Sem barra do navegador
- ✅ `orientation: "portrait"` - Apenas vertical
- ✅ `theme_color: "#A076F9"` - Cor da barra de status
- ✅ `background_color: "#ECE8FF"` - Cor da splash screen

### Service Worker (já configurado)
- ✅ Cache de rotas principais
- ✅ Estratégia Network First
- ✅ Fallback para offline
- ✅ Auto-atualização

## 📊 Teste de Auditoria

Use o Lighthouse para verificar a qualidade do PWA:

1. Abra Chrome DevTools
2. Vá em "Lighthouse"
3. Marque "Progressive Web App"
4. Clique em "Generate report"

**Meta: 90+ pontos**

## ⚠️ Importante

### Requisitos para PWA:
- ✅ HTTPS (em produção)
- ✅ Service Worker registrado
- ✅ Manifest.json válido
- ⚠️ Ícones (você precisa adicionar)
- ✅ Responsivo
- ✅ Rápido

### Testando Localmente com HTTPS:
```bash
# Use ngrok ou similar para HTTPS local
npx ngrok http 3000
```

## 🎯 Checklist Final

Antes de considerar o PWA completo:

- [ ] Adicionar ícones reais (192x192 e 512x512)
- [ ] Testar instalação no Android
- [ ] Testar instalação no iOS
- [ ] Verificar funcionamento offline
- [ ] Auditoria Lighthouse (90+)
- [ ] Deploy em HTTPS
- [ ] Testar atualização do Service Worker
- [ ] Screenshots para manifest (opcional)

## 📚 Recursos

- [MDN - PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [PWA Builder](https://www.pwabuilder.com/)

---

**Status**: 🟡 PWA Configurado - Aguardando ícones e deploy HTTPS
