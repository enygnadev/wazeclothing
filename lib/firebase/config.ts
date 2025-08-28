// lib/firebase.ts

import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi097jLQftvdSvLkUqnP3l_qD3tHRefjg",
  authDomain: "wazeclothing.firebaseapp.com",
  projectId: "wazeclothing",
  storageBucket: "wazeclothing.appspot.com",
  messagingSenderId: "222417382187",
  appId: "1:222417382187:web:0b574f48c95d351c72336e",
  measurementId: "G-37QLR4P8CP",
}

// Check required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  console.warn('⚠️ Usando configuração Firebase padrão para desenvolvimento')
} else {
  console.log('✅ Configuração Firebase carregada com sucesso')
}

// ⚙️ Inicializa o app somente uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// 📦 Exportações para Firebase services
export let auth: Auth
export let firestore: Firestore
export let storage: FirebaseStorage
export let analytics: ReturnType<typeof getAnalytics> | null = null

// Inicializa os serviços do Firebase
if (typeof window !== "undefined") {
  auth = getAuth(app)
  firestore = getFirestore(app)
  storage = getStorage(app)

  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch((err) => {
    console.warn("🔇 Firebase Analytics não suportado:", err)
  })
}

// ✅ Exportações
export { app }