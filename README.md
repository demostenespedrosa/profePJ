# 🎓 Profe PJ

> Seu assistente pessoal para organizar a vida financeira de professor MEI

**Profe PJ** é uma aplicação web progressiva (PWA) que transforma a gestão financeira de professores microempreendedores em uma experiência gamificada, intuitiva e motivadora. Esqueça planilhas complicadas e cálculos manuais - deixe o Profe PJ cuidar da parte chata enquanto você foca no que realmente importa: ensinar! 🚀

## ✨ Destaques

- 🎮 **Gamificação:** Sistema de streaks, XP e "derrote o Monstro do DAS"
- 🤖 **IA Generativa:** Saudações personalizadas e feedback motivacional com Google Gemini
- 💰 **Potinhos Automágicos:** Alocação automática para 13º, férias e seus sonhos
- 📅 **Agenda Inteligente:** Calendário visual com importação em lote de aulas
- 🎉 **Feedback Dopaminérgico:** Animações, confetti e celebrações a cada conquista
- 🏖️ **Gestão de Recessos:** Alertas proativos e cálculo automático de metas

## 🚀 Tecnologias

### Frontend
- **Next.js 15** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** (design system customizado)
- **Radix UI** (componentes acessíveis)
- **React Hook Form** + **Zod** (validação)

### Backend & Database
- **Firebase Authentication** (email/senha)
- **Cloud Firestore** (banco NoSQL em tempo real)
- **Firebase Security Rules**

### IA & Automação
- **Google Genkit** (orquestração de IA)
- **Gemini 2.5 Flash** (geração de conteúdo personalizado)

## 📦 Instalação

### Pré-requisitos
- Node.js 20+ 
- npm ou yarn
- Conta Firebase

### Configuração

1. **Clone o repositório:**
```bash
git clone https://github.com/demostenespedrosa/profePJ.git
cd profePJ
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id

# Google AI (Genkit)
GOOGLE_GENAI_API_KEY=sua_gemini_api_key
```

4. **Configure o Firebase:**
- Crie um projeto no [Firebase Console](https://console.firebase.google.com)
- Ative Authentication (Email/Password)
- Crie um banco Firestore
- Atualize o arquivo `src/firebase/config.ts` com suas credenciais

5. **Deploy das Firestore Rules:**
```bash
firebase deploy --only firestore:rules
```

## 🎯 Executando o Projeto

### Modo Desenvolvimento

**Aplicação Next.js:**
```bash
npm run dev
```
Acesse: [http://localhost:9002](http://localhost:9002)

**Genkit Dev UI (para testar fluxos de IA):**
```bash
npm run genkit:dev
```

**Genkit com hot reload:**
```bash
npm run genkit:watch
```

### Modo Produção

```bash
npm run build
npm start
```

## 📱 Funcionalidades Principais

### 🗣️ Cadastro Conversacional
Interface de chat amigável que coleta informações do usuário de forma natural:
- Nome e informações pessoais
- Escola e valor/hora
- Dia de vencimento do DAS
- Criação automática de potinhos obrigatórios

### 🏠 Dashboard Inteligente
- Saudações personalizadas geradas por IA
- Estatísticas do mês (aulas e ganhos)
- Alertas contextuais (DAS, recessos, metas)
- Cards de ação motivacionais

### 📆 Agenda de Aulas
- Calendário visual com indicadores coloridos
- Importação em lote de aulas
- Bloqueio automático de períodos de recesso
- Detalhamento por instituição

### 🏺 Sistema de Potinhos
- **Obrigatórios:** Férias e 13º salário (calculados automaticamente)
- **Sonhos:** Metas personalizadas com deadline
- Alocação percentual de cada ganho
- Sugestões inteligentes de economia

### 🏫 Gestão de Instituições
- Cadastro de múltiplas escolas
- Valor/hora diferenciado por instituição
- Cores identificadoras
- Períodos de recesso

### ⚔️ Gamificação do DAS
- "Monstro do DAS" para derrotar todo mês
- Animação de confetti ao pagar
- Alertas 5 dias antes do vencimento
- Registro histórico de pagamentos

## 🗂️ Estrutura do Projeto

```
profePJ/
├── src/
│   ├── app/                    # Rotas Next.js (App Router)
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── login/             # Autenticação
│   │   ├── cadastro/          # Onboarding conversacional
│   │   ├── agenda/            # Calendário de aulas
│   │   ├── potinhos/          # Gestão de economias
│   │   ├── instituicoes/      # CRUD de escolas
│   │   └── perfil/            # Configurações do usuário
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes Radix UI
│   │   ├── profe/            # Componentes específicos
│   │   └── layout/           # Layouts (nav, screen)
│   ├── firebase/             # Configuração e hooks Firebase
│   │   ├── firestore/        # Hooks de dados
│   │   └── config.ts         # Credenciais
│   ├── ai/                   # Fluxos Genkit + Gemini
│   │   ├── genkit.ts         # Setup
│   │   └── flows/            # Fluxos de IA
│   ├── lib/                  # Utilitários
│   ├── hooks/                # React hooks customizados
│   └── types/                # Tipos TypeScript
├── docs/                     # Documentação
│   ├── blueprint.md          # Especificações do produto
│   └── backend.json          # Modelo de dados
├── firestore.rules           # Regras de segurança
└── package.json
```

## 🎨 Design System

### Cores
- **Primary:** `#A076F9` (roxo saturado - organização e confiabilidade)
- **Background:** `#ECE8FF` (lilás claro - profissionalismo acolhedor)
- **Accent:** `#76A0F9` (azul saturado - CTAs e alertas)

### Tipografia
- **Fonte:** PT Sans (humanista, moderna e calorosa)
- **Body:** 16px (legibilidade prioritária)

### Filosofia
- Interface iOS-like (aparência nativa)
- Animações suaves e celebratórias
- Feedback visual imediato
- Mobile-first

## 🔐 Segurança

- Autenticação Firebase com cookies HTTP
- Firestore Rules: usuários acessam apenas seus dados
- Middleware Next.js protege rotas privadas
- Validação de dados com Zod

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e pertence a Demostenes Pedrosa.

## 👨‍💻 Autor

**Demostenes Pedrosa**
- GitHub: [@demostenespedrosa](https://github.com/demostenespedrosa)

## 📱 PWA (Progressive Web App)

O Profe PJ é um **PWA completo**! Isso significa que você pode:

- ✅ **Instalar no celular** como um app nativo
- ✅ **Usar offline** (funcionalidades básicas)
- ✅ **Receber notificações** (em breve)
- ✅ **Atualizações automáticas**

### Como instalar:

**Android (Chrome):**
1. Acesse o app no navegador
2. Toque em "Adicionar à tela inicial" quando aparecer o banner
3. Ou: Menu ⋮ > "Instalar aplicativo"

**iOS (Safari):**
1. Toque no botão de compartilhar 
2. Selecione "Adicionar à Tela de Início"

**Desktop (Chrome/Edge):**
1. Clique no ícone de instalação na barra de endereço
2. Ou: Menu ⋮ > "Instalar Profe PJ"

📖 [Guia completo do PWA](./docs/PWA-GUIDE.md)

## 🎯 Roadmap

- [x] PWA com Service Worker e modo offline
- [ ] Ícones de app personalizados
- [ ] Cloud Function para distribuição automática nos potinhos
- [ ] Som "ka-ching" ao completar aulas
- [ ] Haptic feedback em dispositivos móveis
- [ ] Notificações push para DAS e metas
- [ ] Sincronização em background (criar aulas offline)
- [ ] Gráficos de evolução financeira
- [ ] Exportação de relatórios para contabilidade
- [ ] Integração com bancos (Open Finance)

---

Feito com 💜 para professores que merecem mais tempo para o que realmente importa.