// scripts/setupBlasiusProducts.js
require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("❌ Erro: Variáveis de ambiente do Firebase não encontradas!");
  process.exit(1);
}

console.log(`🔥 Conectando ao Firebase: ${firebaseConfig.projectId}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para gerar URL da imagem baseada no nome e categoria
function generateImageUrl(title, category, index) {
  const cleanTitle = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-')        // Substitui espaços por hífen
    .replace(/#\d+/g, '');       // Remove números de sequência

  const cleanCategory = category.toLowerCase().replace('-', ' ');

  // URL estável com variação pelo index
  return `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=600&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&shirt=${cleanTitle}&category=${cleanCategory}`;
}

// Produtos extraídos da NF-e (Big Riders) das imagens
const BlasiusProducts = [
  // 1953 — Regata Básica 100% Algodão (R$ 38,10)
  {
    "title": "1953 Regata Básica 100% Algodão Preto G",
    "description": "Regata básica 100% algodão, confortável e casual.",
    "price": 38.10,
    "image": generateImageUrl("1953 Regata Básica 100% Algodão Preto G", "regata", 1),
    "category": "regata",
    "features": ["Regata", "Algodão 100%", "G", "Preto"],
    "featured": false,
    "size": "G",
    "isSmart": false
  },
  {
    "title": "1953 Regata Básica 100% Algodão Branco G",
    "description": "Regata básica 100% algodão, confortável e casual.",
    "price": 38.10,
    "image": generateImageUrl("1953 Regata Básica 100% Algodão Branco G", "regata", 2),
    "category": "regata",
    "features": ["Regata", "Algodão 100%", "G", "Branco"],
    "featured": false,
    "size": "G",
    "isSmart": false
  },
  {
    "title": "1953 Regata Básica 100% Algodão Mescla G",
    "description": "Regata básica 100% algodão, confortável e casual.",
    "price": 38.10,
    "image": generateImageUrl("1953 Regata Básica 100% Algodão Mescla G", "regata", 3),
    "category": "regata",
    "features": ["Regata", "Algodão 100%", "G", "Mescla"],
    "featured": false,
    "size": "G",
    "isSmart": false
  },

  // 1095 — Camiseta Básica Premium (R$ 36,35)
  {
    "title": "1095 Camiseta Básica Premium Preto G",
    "description": "Camiseta básica premium em algodão, toque macio e alta durabilidade.",
    "price": 36.35,
    "image": generateImageUrl("1095 Camiseta Básica Premium Preto G", "camiseta-premium", 4),
    "category": "camiseta-premium",
    "features": ["Camiseta", "Premium", "Algodão", "G", "Preto"],
    "featured": false,
    "size": "G",
    "isSmart": false
  },
  {
    "title": "1095 Camiseta Básica Premium Branco G",
    "description": "Camiseta básica premium em algodão, toque macio e alta durabilidade.",
    "price": 36.35,
    "image": generateImageUrl("1095 Camiseta Básica Premium Branco G", "camiseta-premium", 5),
    "category": "camiseta-premium",
    "features": ["Camiseta", "Premium", "Algodão", "G", "Branco"],
    "featured": false,
    "size": "G",
    "isSmart": false
  },
  {
    "title": "1095 Camiseta Básica Premium Mescla G",
    "description": "Camiseta básica premium em algodão, toque macio e alta durabilidade.",
    "price": 36.35,
    "image": generateImageUrl("1095 Camiseta Básica Premium Mescla G", "camiseta-premium", 6),
    "category": "camiseta-premium",
    "features": ["Camiseta", "Premium", "Algodão", "G", "Mescla"],
    "featured": false,
    "size": "G",
    "isSmart": false
  },
];

async function checkProductExists(title) {
  const q = query(collection(db, "products"), where("title", "==", title));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function setupBlasiusProducts() {
  console.log("🧾 Inserindo produtos da NF-e (Big Riders)...");
  let added = 0, skipped = 0;

  for (const product of BlasiusProducts) {
    const exists = await checkProductExists(product.title);
    if (exists) {
      console.log(`⏭️  Já existe: ${product.title}`);
      skipped++;
    } else {
      const productData = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: "nf-000029012" // tag opcional para filtro
      };

      const docRef = await addDoc(collection(db, "products"), productData);
      console.log(`✅ Adicionado: ${product.title} (ID: ${docRef.id})`);
      added++;
    }
  }
  console.log(`🎯 Total: ${added} adicionados, ${skipped} ignorados.`);
}

setupBlasiusProducts().catch((error) => {
  console.error("❌ Erro ao inserir produtos:", error);
  process.exit(1);
});
