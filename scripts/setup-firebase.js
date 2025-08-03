#!/usr/bin/env node

/**
 * Script para configurar dados iniciais no Firebase
 * Execute: node scripts/setup-firebase.js
 */

const { initializeApp } = require("firebase/app")
const { getFirestore, collection, addDoc } = require("firebase/firestore")

// Configuração do Firebase (substitua pelas suas credenciais)
const firebaseConfig = {
  // Suas credenciais aqui
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Produtos de exemplo
const sampleProducts = [
  {
    title: "Smartphone Galaxy S24",
    description: "Smartphone premium com câmera de 108MP e tela AMOLED de 6.8 polegadas",
    price: 2499.99,
    image: "https://via.placeholder.com/400x400/007bff/ffffff?text=Galaxy+S24",
    featured: true,
    createdAt: new Date(),
  },
  {
    title: "Notebook Dell Inspiron",
    description: "Notebook para trabalho e estudos com processador Intel i7 e 16GB RAM",
    price: 3299.99,
    image: "https://via.placeholder.com/400x400/28a745/ffffff?text=Dell+Inspiron",
    featured: false,
    createdAt: new Date(),
  },
  {
    title: "Fone Bluetooth Sony",
    description: "Fone de ouvido sem fio com cancelamento de ruído ativo",
    price: 899.99,
    image: "https://via.placeholder.com/400x400/dc3545/ffffff?text=Sony+Fone",
    featured: true,
    createdAt: new Date(),
  },
  {
    title: 'Smart TV 55" LG',
    description: "Smart TV 4K com sistema webOS e HDR10",
    price: 2199.99,
    image: "https://via.placeholder.com/400x400/ffc107/000000?text=LG+Smart+TV",
    featured: false,
    createdAt: new Date(),
  },
]

async function setupFirebase() {
  try {
    console.log("🔥 Configurando dados iniciais no Firebase...")

    // Adicionar produtos de exemplo
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, "products"), product)
      console.log(`✅ Produto adicionado: ${product.title} (ID: ${docRef.id})`)
    }

    console.log("🎉 Configuração concluída com sucesso!")
    console.log("📱 Agora você pode executar: npm run dev")
  } catch (error) {
    console.error("❌ Erro ao configurar Firebase:", error)
  }
}

setupFirebase()
