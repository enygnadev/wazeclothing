
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

const BlasiusProducts = [
  {
    "title": "Nike Tech Fleece #1",
    "description": "Camisa Nike modelo Tech Fleece, urbana, confortável e estilosa.",
    "price": 311.19,
    "image": "https://source.unsplash.com/random/400x400?sig=0&clothes,nike",
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
    "image": "https://source.unsplash.com/random/400x400?sig=2&clothes,nike",
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
    "image": "https://source.unsplash.com/random/400x400?sig=4&clothes,nike",
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
    "image": "https://source.unsplash.com/random/400x400?sig=6&clothes,nike",
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
    "image": "https://source.unsplash.com/random/400x400?sig=8&clothes,nike",
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
    "image": "https://source.unsplash.com/random/400x400?sig=10&clothes,adidas",
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
    "image": "https://source.unsplash.com/random/400x400?sig=12&clothes,adidas",
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
    "image": "https://source.unsplash.com/random/400x400?sig=20&clothes,lacoste",
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
    "image": "https://source.unsplash.com/random/400x400?sig=30&clothes,jordan",
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
    "image": "https://source.unsplash.com/random/400x400?sig=40&clothes,puma",
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
    "image": "https://source.unsplash.com/random/400x400?sig=50&clothes,premium",
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
    "image": "https://source.unsplash.com/random/400x400?sig=60&clothes,mais vendidos",
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
