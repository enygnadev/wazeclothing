
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
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/#\d+/g, ''); // Remove números de sequência
  
  const cleanCategory = category.toLowerCase().replace('-', ' ');
  
  // Monta a URL com parâmetros específicos para cada produto
  return `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=600&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&shirt=${cleanTitle}&category=${cleanCategory}`;
}

const BlasiusProducts = [
  {
    "title": "Nike Tech Fleece #1",
    "description": "Camisa Nike modelo Tech Fleece, urbana, confortável e estilosa.",
    "price": 311.19,
    "image": generateImageUrl("Nike Tech Fleece #1", "nike", 1),
    "category": "nike",
    "features": [
      "Nike",
      "Tech Fleece",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "GG",
    "isSmart": false
  },
  {
    "title": "Nike Tech Fleece #2",
    "description": "Camisa Nike modelo Tech Fleece, urbana, confortável e estilosa.",
    "price": 296.36,
    "image": generateImageUrl("Nike Tech Fleece #2", "nike", 2),
    "category": "nike",
    "features": [
      "Nike",
      "Tech Fleece",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "G",
    "isSmart": false
  },
  {
    "title": "Nike Dry Fit #3",
    "description": "Camisa Nike modelo Dry Fit, urbana, confortável e estilosa.",
    "price": 277.12,
    "image": generateImageUrl("Nike Dry Fit #3", "nike", 3),
    "category": "nike",
    "features": [
      "Nike",
      "Dry Fit",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "G",
    "isSmart": false
  },
  {
    "title": "Nike Tech Fleece #4",
    "description": "Camisa Nike modelo Tech Fleece, urbana, confortável e estilosa.",
    "price": 337.86,
    "image": generateImageUrl("Nike Tech Fleece #4", "nike", 4),
    "category": "nike",
    "features": [
      "Nike",
      "Tech Fleece",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false
  },
  {
    "title": "Nike Dry Fit #5",
    "description": "Camisa Nike modelo Dry Fit, urbana, confortável e estilosa.",
    "price": 239.7,
    "image": generateImageUrl("Nike Dry Fit #5", "nike", 5),
    "category": "nike",
    "features": [
      "Nike",
      "Dry Fit",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false
  },
  {
    "title": "Adidas Originals #1",
    "description": "Camisa Adidas modelo Originals, urbana, confortável e estilosa.",
    "price": 359.01,
    "image": generateImageUrl("Adidas Originals #1", "adidas", 6),
    "category": "adidas",
    "features": [
      "Adidas",
      "Originals",
      "XG",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "XG",
    "isSmart": false
  },
  {
    "title": "Adidas 4DFWD #2",
    "description": "Camisa Adidas modelo 4DFWD, urbana, confortável e estilosa.",
    "price": 305.64,
    "image": generateImageUrl("Adidas 4DFWD #2", "adidas", 7),
    "category": "adidas",
    "features": [
      "Adidas",
      "4DFWD",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "M",
    "isSmart": false
  },
  {
    "title": "Lacoste Sport #1",
    "description": "Camisa Lacoste modelo Sport, urbana, confortável e estilosa.",
    "price": 187.2,
    "image": generateImageUrl("Lacoste Sport #1", "lacoste", 8),
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Sport",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "G",
    "isSmart": false
  },
  {
    "title": "Jordan Essentials #1",
    "description": "Camisa Jordan modelo Essentials, urbana, confortável e estilosa.",
    "price": 203.49,
    "image": generateImageUrl("Jordan Essentials #1", "jordan", 9),
    "category": "jordan",
    "features": [
      "Jordan",
      "Essentials",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "P",
    "isSmart": false
  },
  {
    "title": "Puma Classics #1",
    "description": "Camisa Puma modelo Classics, urbana, confortável e estilosa.",
    "price": 211.75,
    "image": generateImageUrl("Puma Classics #1", "puma", 10),
    "category": "puma",
    "features": [
      "Puma",
      "Classics",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "P",
    "isSmart": false
  },
  {
    "title": "Premium LuxFit #1",
    "description": "Camisa Premium modelo LuxFit, urbana, confortável e estilosa.",
    "price": 246.05,
    "image": generateImageUrl("Premium LuxFit #1", "premium", 11),
    "category": "premium",
    "features": [
      "Premium",
      "LuxFit",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "GG",
    "isSmart": false
  },
  {
    "title": "Mais Vendidos TopTrend #1",
    "description": "Camisa Mais Vendidos modelo TopTrend, urbana, confortável e estilosa.",
    "price": 242.49,
    "image": generateImageUrl("Mais Vendidos TopTrend #1", "mais-vendidos", 12),
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "TopTrend",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "GG",
    "isSmart": false
  }
];

async function checkProductExists(title) {
  const q = query(collection(db, "products"), where("title", "==", title));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function setupBlasiusProducts() {
  console.log("🧢 Inserindo produtos da Blasius Clothing...");
  let added = 0, skipped = 0;
  
  for (const product of BlasiusProducts) {
    const exists = await checkProductExists(product.title);
    if (exists) {
      console.log(`⏭️  Já existe: ${product.title}`);
      skipped++;
    } else {
      // Adicionar timestamps
      const productData = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
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
