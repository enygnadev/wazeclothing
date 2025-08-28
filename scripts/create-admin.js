
const { initializeApp } = require('firebase/app')
const { getFirestore, doc, setDoc } = require('firebase/firestore')
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth')

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

async function createAdmin() {
  try {
    console.log('🔧 Configurando usuário administrador...')
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const auth = getAuth(app)
    
    // Dados do admin
    const adminEmail = 'admin@waze.com'
    const adminPassword = 'admin123456'
    
    console.log('📧 Criando usuário no Firebase Auth...')
    
    // Criar usuário na autenticação
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    const user = userCredential.user
    
    console.log('✅ Usuário criado no Auth:', user.uid)
    
    // Criar documento do usuário no Firestore
    const adminUserData = {
      email: adminEmail,
      name: 'Administrador',
      displayName: 'Administrador Waze',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      consentDate: new Date(),
      consentVersion: "1.0",
      uid: user.uid
    }
    
    await setDoc(doc(db, 'users', user.uid), adminUserData)
    
    console.log('✅ Usuário administrador configurado com sucesso!')
    console.log('')
    console.log('📋 Dados de acesso:')
    console.log('📧 Email:', adminEmail)
    console.log('🔑 Senha:', adminPassword)
    console.log('🆔 UID:', user.uid)
    console.log('')
    console.log('🚀 Agora você pode fazer login na área administrativa!')
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️ Email já existe, configurando apenas o perfil no Firestore...')
      
      // Se o usuário já existe, apenas atualizar o perfil
      const app = initializeApp(firebaseConfig)
      const db = getFirestore(app)
      
      const adminUserData = {
        email: 'admin@waze.com',
        name: 'Administrador',
        displayName: 'Administrador Waze',
        isAdmin: true,
        updatedAt: new Date(),
        consentDate: new Date(),
        consentVersion: "1.0"
      }
      
      // Usar um ID genérico para o admin existente
      await setDoc(doc(db, 'users', 'admin-user-id'), adminUserData)
      console.log('✅ Perfil de admin configurado!')
      
    } else {
      console.error('❌ Erro ao configurar admin:', error.message)
    }
  }
}

createAdmin()
