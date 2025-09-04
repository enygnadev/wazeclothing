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

/**
 * Config "catálogo" vindo da NF/Imagens
 * Categorias e conjunto de tamanhos por paths informados
 */
const CATEGORY_PATH = "/categories/5K2mKNJcwem0Ihgm9piy"; // categoria única p/ camisetas
const SIZESET_PATH = "/sizes/2EbWRRl9NznOYZK6kqo0";      // referência do conjunto de tamanhos (informativo)

const NOW = new Date();
const img = (seed) =>
  `https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80&sat=-30&exp=-5&ixid=${seed}`;

/**
 * Produtos NORMALIZADOS (somente os que apareceram na NF/imagens)
 * Usando `sizes` (array) e mantendo `title` único por cor + código.
 * `category` usa o path passado. `features` guarda metadados úteis (código, cor etc).
 */
const NF_PRODUCTS = [
  // 19514 Camiseta Básica 100% Algodão BRANCO – R$ 42,85 (M/G/GG)
  {
    id: "19514-BRANCO",
    title: "19514 Camiseta Básica 100% Algodão BRANCO",
    name: "Camiseta Básica 100% Algodão",
    description: "Camiseta básica 100% algodão (cód. 19514), cor BRANCO.",
    price: 42.85,
    image: img("19514B"),
    category: CATEGORY_PATH,
    featured: false,
    features: ["19514", "Básica", "Algodão 100%", "Branco", `sizeset:${SIZESET_PATH}`],
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19207 Camiseta Básica 100% Algodão SORTIDA – R$ 36,35 (M/G/GG)
  {
    id: "19207-SORTIDA",
    title: "19207 Camiseta Básica 100% Algodão SORTIDA",
    name: "Camiseta Básica 100% Algodão",
    description: "Camiseta básica 100% algodão (cód. 19207), cores SORTIDAS.",
    price: 36.35,
    image: img("19207S"),
    category: CATEGORY_PATH,
    featured: false,
    features: ["19207", "Básica", "Algodão 100%", "Sortida", `sizeset:${SIZESET_PATH}`],
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19540 Regata Básica 100% Algodão BRANCO – R$ 42,85 (M/G/GG)
  {
    id: "19540-BRANCO",
    title: "19540 Regata Básica 100% Algodão BRANCO",
    name: "Regata Básica 100% Algodão",
    description: "Regata básica 100% algodão (cód. 19540), cor BRANCO.",
    price: 42.85,
    image: img("19540B"),
    category: CATEGORY_PATH,
    featured: false,
    features: ["19540", "Regata", "Algodão 100%", "Branco", `sizeset:${SIZESET_PATH}`],
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19543 Regata Básica 100% Algodão PRETO – R$ 38,10 (M/G/GG)
  {
    id: "19543-PRETO",
    title: "19543 Regata Básica 100% Algodão PRETO",
    name: "Regata Básica 100% Algodão",
    description: "Regata básica 100% algodão (cód. 19543), cor PRETO.",
    price: 38.10,
    image: img("19543P"),
    category: CATEGORY_PATH,
    featured: false,
    features: ["19543", "Regata", "Algodão 100%", "Preto", `sizeset:${SIZESET_PATH}`],
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19551 Camiseta Premium OVERSIZED 62%CO/38%PES SORTIDA – R$ 72,72 (M/G/GG)
  {
    id: "19551-OVERSIZED-SORTIDA",
    title: "19551 Camiseta Premium OVERSIZED SORTIDA",
    name: "Camiseta Premium Oversized",
    description:
      "Camiseta premium oversized (cód. 19551), 62% algodão / 38% poliéster, cores SORTIDAS.",
    price: 72.72,
    image: img("19551O"),
    category: CATEGORY_PATH,
    featured: false,
    features: ["19551", "Premium", "Oversized", "62%CO/38%PES", "Sortida", `sizeset:${SIZESET_PATH}`],
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19562 Camiseta Premium CLEAN 100% Algodão PRETO – R$ 36,35 (M/G/GG)
  {
    id: "19562-CLEAN-PRETO",
    title: "19562 Camiseta Premium CLEAN PRETO",
    name: "Camiseta Premium Clean",
    description: "Camiseta premium CLEAN 100% algodão (cód. 19562), cor PRETO.",
    price: 36.35,
    image: img("19562P"),
    category: CATEGORY_PATH,
    featured: false,
    features: ["19562", "Premium", "Clean", "Algodão 100%", "Preto", `sizeset:${SIZESET_PATH}`],
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // 19563 Camiseta Premium CLEAN 100% Algodão BRANCO – R$ 36,35 (M/G/GG)
  {
    id: "19563-CLEAN-BRANCO",
    title: "19563 Camiseta Premium CLEAN BRANCO",
    name: "Camiseta Premium Clean",
    description: "Camiseta premium CLEAN 100% algodão (cód. 19563), cor BRANCO.",
    price: 36.35,
    image: img("19563B"),
    category: CATEGORY_PATH,
    featured: false,
    features: ["19563", "Premium", "Clean", "Algodão 100%", "Branco", `sizeset:${SIZESET_PATH}`],
    sizes: ["M", "G", "GG"],
    isSmart: false,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

/** Mantive sua checagem por título */
async function checkProductExists(title) {
  const qy = query(collection(db, "products"), where("title", "==", title));
  const snapshot = await getDocs(qy);
  return !snapshot.empty;
}

async function setupBlasiusProducts() {
  console.log("👕 Inserindo produtos da NF (Big Riders)...");
  let added = 0,
    skipped = 0;

  for (const p of NF_PRODUCTS) {
    const exists = await checkProductExists(p.title);
    if (exists) {
      console.log(`⏭️  Já existe: ${p.title}`);
      skipped++;
      continue;
    }

    // Garante tipos compatíveis com seu Product (Date em createdAt/updatedAt)
    const docData = {
      ...p,
      createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt || Date.now()),
      updatedAt: new Date(),
      // mantive `size` vazio (estoque por variação de tamanho) e `sizes` com a grade
      size: p.size ?? undefined,
    };

    const ref = await addDoc(collection(db, "products"), docData);
    console.log(`✅ Adicionado: ${p.title} (ID Firestore: ${ref.id})`);
    added++;
  }

  console.log(`🎯 Total: ${added} adicionados, ${skipped} ignorados.`);
}

setupBlasiusProducts().catch((e) => {
  console.error("❌ Falha ao inserir produtos:", e);
  console.error(
    "Se aparecer PERMISSION_DENIED, ajuste as regras do Firestore ou execute com credenciais que tenham permissão de escrita."
  );
});
