
// scripts/setup-blasius-products.js
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

const NOW = new Date();

// Produtos extraídos da NF-e (Big Riders) das imagens
const BlasiusProducts = [
  // 19514 Camiseta Básica 100% Algodão BRANCO – R$ 42,85 (M/G/GG)
  {
    title: "19514 Camiseta Básica 100% Algodão BRANCO",
    name: "Camiseta Básica 100% Algodão",
    description: "Camiseta básica 100% algodão, confortável e casual. Modelo 19514 na cor branca.",
    price: 42.85,
    image: generateImageUrl("19514 Camiseta Básica Branco", "camiseta", 1),
    category: "camiseta",
    features: ["19514", "Básica", "Algodão 100%", "Branco"],
    featured: false,
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19207 Camiseta Básica 100% Algodão SORTIDA – R$ 36,35 (M/G/GG)
  {
    title: "19207 Camiseta Básica 100% Algodão SORTIDA",
    name: "Camiseta Básica 100% Algodão",
    description: "Camiseta básica 100% algodão, cores sortidas. Modelo 19207.",
    price: 36.35,
    image: generateImageUrl("19207 Camiseta Básica Sortida", "camiseta", 2),
    category: "camiseta",
    features: ["19207", "Básica", "Algodão 100%", "Sortida"],
    featured: false,
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19540 Regata Básica 100% Algodão BRANCO – R$ 42,85 (M/G/GG)
  {
    title: "19540 Regata Básica 100% Algodão BRANCO",
    name: "Regata Básica 100% Algodão",
    description: "Regata básica 100% algodão, confortável e casual. Modelo 19540 na cor branca.",
    price: 42.85,
    image: generateImageUrl("19540 Regata Básica Branco", "regata", 3),
    category: "regata",
    features: ["19540", "Regata", "Algodão 100%", "Branco"],
    featured: false,
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19543 Regata Básica 100% Algodão PRETO – R$ 38,10 (M/G/GG)
  {
    title: "19543 Regata Básica 100% Algodão PRETO",
    name: "Regata Básica 100% Algodão",
    description: "Regata básica 100% algodão, confortável e casual. Modelo 19543 na cor preta.",
    price: 38.10,
    image: generateImageUrl("19543 Regata Básica Preto", "regata", 4),
    category: "regata",
    features: ["19543", "Regata", "Algodão 100%", "Preto"],
    featured: false,
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19551 Camiseta Premium OVERSIZED 62%CO/38%PES SORTIDA – R$ 72,72 (M/G/GG)
  {
    title: "19551 Camiseta Premium OVERSIZED SORTIDA",
    name: "Camiseta Premium Oversized",
    description: "Camiseta premium oversized, 62% algodão / 38% poliéster, cores sortidas. Modelo 19551.",
    price: 72.72,
    image: generateImageUrl("19551 Camiseta Premium Oversized", "premium", 5),
    category: "premium",
    features: ["19551", "Premium", "Oversized", "62%CO/38%PES", "Sortida"],
    featured: true,
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19562 Camiseta Premium CLEAN 100% Algodão PRETO – R$ 36,35 (M/G/GG)
  {
    title: "19562 Camiseta Premium CLEAN PRETO",
    name: "Camiseta Premium Clean",
    description: "Camiseta premium CLEAN 100% algodão, cor preta. Modelo 19562.",
    price: 36.35,
    image: generateImageUrl("19562 Camiseta Premium Clean Preto", "premium", 6),
    category: "premium",
    features: ["19562", "Premium", "Clean", "Algodão 100%", "Preto"],
    featured: false,
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19563 Camiseta Premium CLEAN 100% Algodão BRANCO – R$ 36,35 (M/G/GG)
  {
    title: "19563 Camiseta Premium CLEAN BRANCO",
    name: "Camiseta Premium Clean",
    description: "Camiseta premium CLEAN 100% algodão, cor branca. Modelo 19563.",
    price: 36.35,
    image: generateImageUrl("19563 Camiseta Premium Clean Branco", "premium", 7),
    category: "premium",
    features: ["19563", "Premium", "Clean", "Algodão 100%", "Branco"],
    featured: false,
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
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
