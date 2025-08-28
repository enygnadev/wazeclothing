
#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function setupAdmin() {
  try {
    console.log('🔧 Configurando usuário administrador...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Criar usuário admin de exemplo
    const adminUser = {
      email: 'admin@waze.com',
      name: 'Administrador',
      displayName: 'Administrador Waze',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      consentDate: new Date(),
      consentVersion: "1.0"
    };
    
    await setDoc(doc(db, 'users', 'admin-user-id'), adminUser);
    
    console.log('✅ Usuário administrador configurado!');
    console.log('📧 Email: admin@waze.com');
    console.log('🔑 Senha: admin123 (configure na autenticação)');
    console.log('');
    console.log('⚠️ Lembre-se de:');
    console.log('1. Criar esse usuário no Firebase Authentication');
    console.log('2. Usar email: admin@waze.com');
    console.log('3. Definir uma senha segura');
    
  } catch (error) {
    console.error('❌ Erro ao configurar admin:', error);
  }
}

setupAdmin();
