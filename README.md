# 💡 Waze Clothing - E-Commerce de Iluminação Inteligente

Sistema completo de e-commerce especializado em iluminação inteligente e moderna, desenvolvido com Next.js 15, TypeScript e Firebase.

## 🚀 Instalação e Configuração

### 1. **Clone e Instale:**
\`\`\`bash
git clone <repository-url>
cd Waze-Clothing-ecommerce
npm install
\`\`\`

### 2. **Configure as Variáveis de Ambiente:**

O arquivo `.env.local` já está configurado com as credenciais do seu projeto Firebase:

\`\`\`env
# Firebase Configuration - Waze Clothing
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAa1zWXWHm8MSsKKEvDaG2K_bMKKLdM6wk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=Waze-Clothing.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=Waze-Clothing
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=Waze-Clothing.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=803132691747
NEXT_PUBLIC_FIREBASE_APP_ID=1:803132691747:web:cfe39848490e451a9a2896

# OpenAI API Key (for chatbot)
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### 3. **Configure o Firebase Console:**
- Acesse [Firebase Console](https://console.firebase.google.com/project/Waze-Clothing)
- Ative **Authentication** → Sign-in methods → Email/Password e Google
- Crie um banco **Firestore** (modo teste)
- Ative o **Storage**

### 4. **Adicione Produtos Automaticamente:**
\`\`\`bash
npm run setup-products
\`\`\`

### 5. **Execute o Projeto:**
\`\`\`bash
npm run dev
\`\`\`

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev              # Desenvolvimento (usa .env.local)
npm run build            # Build de produção
npm run setup-products   # Adiciona produtos usando .env.local
npm run deploy           # Deploy para Vercel
\`\`\`

## 🔐 Configuração de Segurança

### **Firestore Rules:**
Configure no Firebase Console → Firestore → Rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - leitura pública, escrita apenas admin
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users - ler/escrever apenas próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Carts - ler/escrever apenas próprio carrinho
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

## 💡 Produtos Pré-configurados

O script `setup-products` adiciona automaticamente 10 produtos de iluminação:

1. **Lâmpada LED Smart WiFi RGB 12W** - R$ 89,90
2. **Lustre Pendente Smart Cristal 60cm** - R$ 1.299,90
3. **Spot LED Embutir Smart 7W** - R$ 159,90
4. **Arandela Externa Smart Solar** - R$ 249,90
5. **Fita LED Smart RGB 5m** - R$ 199,90
6. **Plafon LED Smart 24W** - R$ 329,90
7. **Luminária Mesa Smart Touch** - R$ 449,90
8. **Refletor LED Smart 50W** - R$ 389,90
9. **Pendente Industrial Edison** - R$ 279,90
10. **Kit Iluminação Casa Completa** - R$ 1.899,90

## 🎯 Funcionalidades

### ✅ **Implementado:**
- 🔥 **Firebase totalmente integrado** usando `.env.local`
- 🛍️ **Catálogo de produtos** com categorias
- 🛒 **Carrinho de compras** persistente
- 🔐 **Autenticação** (Email + Google)
- 👨‍💼 **Painel administrativo**
- 🤖 **Chatbot especializado** em iluminação
- 📱 **PWA** - Instalável como app
- 🌙 **Modo escuro/claro**
- 📊 **Anti-duplicação** de produtos

### 🔄 **Próximos Passos:**
- [ ] Adicionar chave OpenAI no `.env.local`
- [ ] Configurar métodos de pagamento
- [ ] Implementar sistema de avaliações
- [ ] Adicionar cupons de desconto

## 🚨 **Importante:**

1. **Todas as configurações** agora usam o `.env.local`
2. **Script de produtos** verifica variáveis de ambiente
3. **Não há mais credenciais hardcoded** no código
4. **Validação automática** das variáveis necessárias

## 📞 Suporte

- 💬 **Chat IA** - Assistente 24/7 especializado em iluminação
- 📧 **Email** - suporte@WazeClothing.com
- 🔧 **Documentação** - README.md completo

---

**Waze Clothing** - *Iluminando o futuro com inteligência* 💡✨
# wazeclothing
