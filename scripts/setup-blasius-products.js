


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
    "id": "12ca9972-db2e-437f-841c-f649a1b2918a",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.738548"
  },
  {
    "id": "dec57d32-b796-47b9-94b0-0ee24814d058",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.739072"
  },
  {
    "id": "d6db0305-dbbe-450f-b881-75c7b18eb924",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.739221"
  },
  {
    "id": "8b54b887-821c-47c0-b1ba-be2ce6f287f2",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.739617"
  },
  {
    "id": "d478548e-c54c-4c11-ae67-18989dc9709d",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.740036"
  },
  {
    "id": "82667953-882a-4e7b-abc4-64c9459a56bb",
    "title": "Nike Dry Fit #6",
    "description": "Camisa Nike modelo Dry Fit, urbana, confortável e estilosa.",
    "price": 292.42,
    "image": "https://source.unsplash.com/random/400x400?sig=10&clothes,nike",
    "category": "nike",
    "features": [
      "Nike",
      "Dry Fit",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.740139"
  },
  {
    "id": "d16392b3-24db-4dce-a465-7f7e9b72b5db",
    "title": "Nike Dry Fit #7",
    "description": "Camisa Nike modelo Dry Fit, urbana, confortável e estilosa.",
    "price": 283.37,
    "image": "https://source.unsplash.com/random/400x400?sig=12&clothes,nike",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.740257"
  },
  {
    "id": "6a614dea-a42a-41a2-b8c5-fe3b666356e0",
    "title": "Nike Tech Fleece #8",
    "description": "Camisa Nike modelo Tech Fleece, urbana, confortável e estilosa.",
    "price": 173.25,
    "image": "https://source.unsplash.com/random/400x400?sig=14&clothes,nike",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.740722"
  },
  {
    "id": "749bb619-a7d0-4676-bd83-010c47ec0c4b",
    "title": "Nike Air Max #9",
    "description": "Camisa Nike modelo Air Max, urbana, confortável e estilosa.",
    "price": 351.84,
    "image": "https://source.unsplash.com/random/400x400?sig=16&clothes,nike",
    "category": "nike",
    "features": [
      "Nike",
      "Air Max",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.741097"
  },
  {
    "id": "21cc0a94-425e-4c84-be65-16f64fc34072",
    "title": "Nike Tech Fleece #10",
    "description": "Camisa Nike modelo Tech Fleece, urbana, confortável e estilosa.",
    "price": 212.28,
    "image": "https://source.unsplash.com/random/400x400?sig=18&clothes,nike",
    "category": "nike",
    "features": [
      "Nike",
      "Tech Fleece",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.741648"
  },
  {
    "id": "02219f4e-adfe-45c7-a19b-b74a10a6bab3",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742150"
  },
  {
    "id": "afc6a51c-9f74-4fd6-b348-b6a4f6345f4c",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742225"
  },
  {
    "id": "127d64f5-781a-4830-b944-fe7d8cc1a92c",
    "title": "Adidas 4DFWD #3",
    "description": "Camisa Adidas modelo 4DFWD, urbana, confortável e estilosa.",
    "price": 83.76,
    "image": "https://source.unsplash.com/random/400x400?sig=14&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "4DFWD",
      "XG",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "XG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742266"
  },
  {
    "id": "06d3088f-663b-4786-afb0-b2679b93f734",
    "title": "Adidas Tiro #4",
    "description": "Camisa Adidas modelo Tiro, urbana, confortável e estilosa.",
    "price": 219.03,
    "image": "https://source.unsplash.com/random/400x400?sig=16&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "Tiro",
      "XG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "XG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742290"
  },
  {
    "id": "c9d0c9bf-4c9b-4a94-8f82-a794efcbe4e1",
    "title": "Adidas 4DFWD #5",
    "description": "Camisa Adidas modelo 4DFWD, urbana, confortável e estilosa.",
    "price": 283.35,
    "image": "https://source.unsplash.com/random/400x400?sig=18&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "4DFWD",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742311"
  },
  {
    "id": "7f7f6bd1-4a94-4998-962a-2f1936b107b9",
    "title": "Adidas Tiro #6",
    "description": "Camisa Adidas modelo Tiro, urbana, confortável e estilosa.",
    "price": 154.87,
    "image": "https://source.unsplash.com/random/400x400?sig=20&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "Tiro",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742332"
  },
  {
    "id": "d205e22c-9093-4764-85c3-2b21f141a923",
    "title": "Adidas Originals #7",
    "description": "Camisa Adidas modelo Originals, urbana, confortável e estilosa.",
    "price": 187.71,
    "image": "https://source.unsplash.com/random/400x400?sig=22&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "Originals",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742367"
  },
  {
    "id": "ad0be09e-0c4f-4a1e-98ef-bee43d93e9ff",
    "title": "Adidas Tiro #8",
    "description": "Camisa Adidas modelo Tiro, urbana, confortável e estilosa.",
    "price": 277.95,
    "image": "https://source.unsplash.com/random/400x400?sig=24&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "Tiro",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742404"
  },
  {
    "id": "564389e0-6eb4-48b9-8345-8c4cb0ef6d9a",
    "title": "Adidas 4DFWD #9",
    "description": "Camisa Adidas modelo 4DFWD, urbana, confortável e estilosa.",
    "price": 129.53,
    "image": "https://source.unsplash.com/random/400x400?sig=26&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "4DFWD",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742424"
  },
  {
    "id": "5d97eaa5-1dc0-442e-acfe-ba669d5953d5",
    "title": "Adidas 4DFWD #10",
    "description": "Camisa Adidas modelo 4DFWD, urbana, confortável e estilosa.",
    "price": 242.86,
    "image": "https://source.unsplash.com/random/400x400?sig=28&clothes,adidas",
    "category": "adidas",
    "features": [
      "Adidas",
      "4DFWD",
      "XG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "XG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742467"
  },
  {
    "id": "37cdf27c-23be-4ffe-b656-f4ef9495bb0a",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742507"
  },
  {
    "id": "bb72e4ee-798c-47d5-9a79-09c4593f2eba",
    "title": "Lacoste Essentials #2",
    "description": "Camisa Lacoste modelo Essentials, urbana, confortável e estilosa.",
    "price": 168.45,
    "image": "https://source.unsplash.com/random/400x400?sig=22&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Essentials",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742526"
  },
  {
    "id": "dbc6bffa-f310-49cf-94a3-4979bba7bb66",
    "title": "Lacoste Sport #3",
    "description": "Camisa Lacoste modelo Sport, urbana, confortável e estilosa.",
    "price": 287.66,
    "image": "https://source.unsplash.com/random/400x400?sig=24&clothes,lacoste",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742544"
  },
  {
    "id": "3152e1fa-fcb1-4920-90a4-6585a99aaf1f",
    "title": "Lacoste Sport #4",
    "description": "Camisa Lacoste modelo Sport, urbana, confortável e estilosa.",
    "price": 204.81,
    "image": "https://source.unsplash.com/random/400x400?sig=26&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Sport",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742565"
  },
  {
    "id": "5b0d273f-305c-42b5-a099-482de5684670",
    "title": "Lacoste Sport #5",
    "description": "Camisa Lacoste modelo Sport, urbana, confortável e estilosa.",
    "price": 127.23,
    "image": "https://source.unsplash.com/random/400x400?sig=28&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Sport",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742583"
  },
  {
    "id": "4c95a879-044f-4239-ac3b-cfd2b0a25af9",
    "title": "Lacoste Essentials #6",
    "description": "Camisa Lacoste modelo Essentials, urbana, confortável e estilosa.",
    "price": 312.77,
    "image": "https://source.unsplash.com/random/400x400?sig=30&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Essentials",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742603"
  },
  {
    "id": "e74ca9ce-1f3a-44d7-827d-b49daf83534f",
    "title": "Lacoste Polo #7",
    "description": "Camisa Lacoste modelo Polo, urbana, confortável e estilosa.",
    "price": 394.71,
    "image": "https://source.unsplash.com/random/400x400?sig=32&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Polo",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742623"
  },
  {
    "id": "64ad271e-b625-4c35-bce4-6b6ac038e94a",
    "title": "Lacoste Essentials #8",
    "description": "Camisa Lacoste modelo Essentials, urbana, confortável e estilosa.",
    "price": 104.99,
    "image": "https://source.unsplash.com/random/400x400?sig=34&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Essentials",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742642"
  },
  {
    "id": "cec839d6-2daa-4b3d-98e2-7d0ec7e970b2",
    "title": "Lacoste Sport #9",
    "description": "Camisa Lacoste modelo Sport, urbana, confortável e estilosa.",
    "price": 224.41,
    "image": "https://source.unsplash.com/random/400x400?sig=36&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Sport",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742661"
  },
  {
    "id": "169f6cd4-7328-459a-8577-47d1699958c3",
    "title": "Lacoste Polo #10",
    "description": "Camisa Lacoste modelo Polo, urbana, confortável e estilosa.",
    "price": 291.81,
    "image": "https://source.unsplash.com/random/400x400?sig=38&clothes,lacoste",
    "category": "lacoste",
    "features": [
      "Lacoste",
      "Polo",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742681"
  },
  {
    "id": "97c9186e-8c9a-4cc7-8c4a-19fe90a0c88f",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742701"
  },
  {
    "id": "7e240500-5859-48f8-a6af-51d12cba98d4",
    "title": "Jordan Flight #2",
    "description": "Camisa Jordan modelo Flight, urbana, confortável e estilosa.",
    "price": 111.01,
    "image": "https://source.unsplash.com/random/400x400?sig=32&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Flight",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742720"
  },
  {
    "id": "1193aac6-f10e-40d2-8de1-eca62fedd3e3",
    "title": "Jordan Flight #3",
    "description": "Camisa Jordan modelo Flight, urbana, confortável e estilosa.",
    "price": 175.68,
    "image": "https://source.unsplash.com/random/400x400?sig=34&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Flight",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742739"
  },
  {
    "id": "d491a20c-4847-4746-b2d4-47e39707042b",
    "title": "Jordan Essentials #4",
    "description": "Camisa Jordan modelo Essentials, urbana, confortável e estilosa.",
    "price": 131.56,
    "image": "https://source.unsplash.com/random/400x400?sig=36&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Essentials",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742760"
  },
  {
    "id": "16862b19-1c6b-4168-96b2-7bf286a57ffc",
    "title": "Jordan Essentials #5",
    "description": "Camisa Jordan modelo Essentials, urbana, confortável e estilosa.",
    "price": 379.69,
    "image": "https://source.unsplash.com/random/400x400?sig=38&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Essentials",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742780"
  },
  {
    "id": "c19ce8a5-a4e0-486b-a4ce-a0ba29a53219",
    "title": "Jordan Flight #6",
    "description": "Camisa Jordan modelo Flight, urbana, confortável e estilosa.",
    "price": 127.74,
    "image": "https://source.unsplash.com/random/400x400?sig=40&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Flight",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742801"
  },
  {
    "id": "ad038da7-bb83-4c86-a7ec-f070b7c69561",
    "title": "Jordan Flight #7",
    "description": "Camisa Jordan modelo Flight, urbana, confortável e estilosa.",
    "price": 171.53,
    "image": "https://source.unsplash.com/random/400x400?sig=42&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Flight",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742819"
  },
  {
    "id": "c772a4cd-1e0a-497a-b115-5441faf3c091",
    "title": "Jordan Essentials #8",
    "description": "Camisa Jordan modelo Essentials, urbana, confortável e estilosa.",
    "price": 338.47,
    "image": "https://source.unsplash.com/random/400x400?sig=44&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Essentials",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742838"
  },
  {
    "id": "ed333251-3c74-491c-99c5-b08f8065246f",
    "title": "Jordan Flight #9",
    "description": "Camisa Jordan modelo Flight, urbana, confortável e estilosa.",
    "price": 305.16,
    "image": "https://source.unsplash.com/random/400x400?sig=46&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Flight",
      "XG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "XG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742856"
  },
  {
    "id": "532d681e-cdf8-4b65-8bc8-00d6f8056874",
    "title": "Jordan Essentials #10",
    "description": "Camisa Jordan modelo Essentials, urbana, confortável e estilosa.",
    "price": 329.38,
    "image": "https://source.unsplash.com/random/400x400?sig=48&clothes,jordan",
    "category": "jordan",
    "features": [
      "Jordan",
      "Essentials",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742876"
  },
  {
    "id": "964e8fdd-4658-4ab1-8c50-e9e330c6022d",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742896"
  },
  {
    "id": "c54f8c66-1778-40de-9797-fb846cfc7f56",
    "title": "Puma Fit #2",
    "description": "Camisa Puma modelo Fit, urbana, confortável e estilosa.",
    "price": 84.7,
    "image": "https://source.unsplash.com/random/400x400?sig=42&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Fit",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742915"
  },
  {
    "id": "467e4fa2-1ec8-40d7-bfc6-49c13ac00cdd",
    "title": "Puma Fit #3",
    "description": "Camisa Puma modelo Fit, urbana, confortável e estilosa.",
    "price": 348.84,
    "image": "https://source.unsplash.com/random/400x400?sig=44&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Fit",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742935"
  },
  {
    "id": "d4d3690a-20e9-4d50-822b-db3b94fb2525",
    "title": "Puma Fit #4",
    "description": "Camisa Puma modelo Fit, urbana, confortável e estilosa.",
    "price": 215.46,
    "image": "https://source.unsplash.com/random/400x400?sig=46&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Fit",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742955"
  },
  {
    "id": "043460bb-23b2-4e66-a560-046de867063e",
    "title": "Puma Evostripe #5",
    "description": "Camisa Puma modelo Evostripe, urbana, confortável e estilosa.",
    "price": 151.9,
    "image": "https://source.unsplash.com/random/400x400?sig=48&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Evostripe",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742975"
  },
  {
    "id": "64b2fd10-6e21-4eab-bfd5-075a2f023689",
    "title": "Puma Evostripe #6",
    "description": "Camisa Puma modelo Evostripe, urbana, confortável e estilosa.",
    "price": 239.98,
    "image": "https://source.unsplash.com/random/400x400?sig=50&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Evostripe",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.742993"
  },
  {
    "id": "ed86990c-6fba-4af7-8f1c-dcdf5d50fdda",
    "title": "Puma Fit #7",
    "description": "Camisa Puma modelo Fit, urbana, confortável e estilosa.",
    "price": 218.38,
    "image": "https://source.unsplash.com/random/400x400?sig=52&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Fit",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743011"
  },
  {
    "id": "c5c0e8e7-1572-4abb-8ac3-e77c5b363660",
    "title": "Puma Fit #8",
    "description": "Camisa Puma modelo Fit, urbana, confortável e estilosa.",
    "price": 326.95,
    "image": "https://source.unsplash.com/random/400x400?sig=54&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Fit",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743030"
  },
  {
    "id": "2e6efb1b-13cb-4edc-a1cd-cf441b5df3c5",
    "title": "Puma Fit #9",
    "description": "Camisa Puma modelo Fit, urbana, confortável e estilosa.",
    "price": 167.23,
    "image": "https://source.unsplash.com/random/400x400?sig=56&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Fit",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743049"
  },
  {
    "id": "2be0977d-bb86-4f4c-a095-235774cb5be4",
    "title": "Puma Classics #10",
    "description": "Camisa Puma modelo Classics, urbana, confortável e estilosa.",
    "price": 173.43,
    "image": "https://source.unsplash.com/random/400x400?sig=58&clothes,puma",
    "category": "puma",
    "features": [
      "Puma",
      "Classics",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743068"
  },
  {
    "id": "cfd08eb5-ee7a-499d-94e4-c8f6bb59ade5",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743089"
  },
  {
    "id": "071e7ebb-2d11-454d-a2f1-be8a8485ac6e",
    "title": "Premium UrbanElite #2",
    "description": "Camisa Premium modelo UrbanElite, urbana, confortável e estilosa.",
    "price": 196.57,
    "image": "https://source.unsplash.com/random/400x400?sig=52&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "UrbanElite",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743111"
  },
  {
    "id": "0492f259-48b4-4076-a6bf-999f7794c663",
    "title": "Premium LuxFit #3",
    "description": "Camisa Premium modelo LuxFit, urbana, confortável e estilosa.",
    "price": 138.73,
    "image": "https://source.unsplash.com/random/400x400?sig=54&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "LuxFit",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743131"
  },
  {
    "id": "fb74a878-f551-493a-a8cf-e52d7748a2c5",
    "title": "Premium LuxFit #4",
    "description": "Camisa Premium modelo LuxFit, urbana, confortável e estilosa.",
    "price": 333.26,
    "image": "https://source.unsplash.com/random/400x400?sig=56&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "LuxFit",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743150"
  },
  {
    "id": "154bdc43-f868-4b5b-99ac-a9f2e57b4761",
    "title": "Premium CoreX #5",
    "description": "Camisa Premium modelo CoreX, urbana, confortável e estilosa.",
    "price": 248.43,
    "image": "https://source.unsplash.com/random/400x400?sig=58&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "CoreX",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743169"
  },
  {
    "id": "276b5b6e-28fe-4afa-8fc3-7979b268daff",
    "title": "Premium LuxFit #6",
    "description": "Camisa Premium modelo LuxFit, urbana, confortável e estilosa.",
    "price": 98.41,
    "image": "https://source.unsplash.com/random/400x400?sig=60&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "LuxFit",
      "XG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "XG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743187"
  },
  {
    "id": "8c437180-5fb6-4af4-9e0a-64c1c13ba290",
    "title": "Premium CoreX #7",
    "description": "Camisa Premium modelo CoreX, urbana, confortável e estilosa.",
    "price": 201.17,
    "image": "https://source.unsplash.com/random/400x400?sig=62&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "CoreX",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743206"
  },
  {
    "id": "b3321501-ebf8-46c6-b826-564c9e377ee9",
    "title": "Premium UrbanElite #8",
    "description": "Camisa Premium modelo UrbanElite, urbana, confortável e estilosa.",
    "price": 237.49,
    "image": "https://source.unsplash.com/random/400x400?sig=64&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "UrbanElite",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743225"
  },
  {
    "id": "8e546dbd-970e-4583-a9f0-ac16aa3f93e9",
    "title": "Premium LuxFit #9",
    "description": "Camisa Premium modelo LuxFit, urbana, confortável e estilosa.",
    "price": 86.2,
    "image": "https://source.unsplash.com/random/400x400?sig=66&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "LuxFit",
      "XG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "XG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743244"
  },
  {
    "id": "2ecbd33d-8a23-497e-8ffc-20c80846fdc9",
    "title": "Premium UrbanElite #10",
    "description": "Camisa Premium modelo UrbanElite, urbana, confortável e estilosa.",
    "price": 360.85,
    "image": "https://source.unsplash.com/random/400x400?sig=68&clothes,premium",
    "category": "premium",
    "features": [
      "Premium",
      "UrbanElite",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743261"
  },
  {
    "id": "d689d8e6-b78b-40fb-8f29-3e72a63f92af",
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
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743281"
  },
  {
    "id": "8fbde142-1c56-4198-b9e2-cff3c6784015",
    "title": "Mais Vendidos PopularFit #2",
    "description": "Camisa Mais Vendidos modelo PopularFit, urbana, confortável e estilosa.",
    "price": 388.67,
    "image": "https://source.unsplash.com/random/400x400?sig=62&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "PopularFit",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743299"
  },
  {
    "id": "78b6a84f-e8b8-47b4-98b0-a8de8045def0",
    "title": "Mais Vendidos TopTrend #3",
    "description": "Camisa Mais Vendidos modelo TopTrend, urbana, confortável e estilosa.",
    "price": 313.3,
    "image": "https://source.unsplash.com/random/400x400?sig=64&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "TopTrend",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": true,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743317"
  },
  {
    "id": "4d44af7b-124b-4ea2-99eb-5d28e157e5b6",
    "title": "Mais Vendidos TopTrend #4",
    "description": "Camisa Mais Vendidos modelo TopTrend, urbana, confortável e estilosa.",
    "price": 297.59,
    "image": "https://source.unsplash.com/random/400x400?sig=66&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "TopTrend",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743335"
  },
  {
    "id": "3669888d-40f9-4b97-b75a-562d02fa2b0c",
    "title": "Mais Vendidos TopTrend #5",
    "description": "Camisa Mais Vendidos modelo TopTrend, urbana, confortável e estilosa.",
    "price": 254.75,
    "image": "https://source.unsplash.com/random/400x400?sig=68&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "TopTrend",
      "P",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "P",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743354"
  },
  {
    "id": "a62552e2-be8f-46cd-8040-3ce99cee0bfc",
    "title": "Mais Vendidos TopTrend #6",
    "description": "Camisa Mais Vendidos modelo TopTrend, urbana, confortável e estilosa.",
    "price": 368.08,
    "image": "https://source.unsplash.com/random/400x400?sig=70&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "TopTrend",
      "G",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "G",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743373"
  },
  {
    "id": "1dff16bb-eab6-4c1e-aa87-912f83c7c999",
    "title": "Mais Vendidos TopTrend #7",
    "description": "Camisa Mais Vendidos modelo TopTrend, urbana, confortável e estilosa.",
    "price": 311.54,
    "image": "https://source.unsplash.com/random/400x400?sig=72&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "TopTrend",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743391"
  },
  {
    "id": "b754181e-4f09-4988-ac96-8c8edd7ef487",
    "title": "Mais Vendidos PopularFit #8",
    "description": "Camisa Mais Vendidos modelo PopularFit, urbana, confortável e estilosa.",
    "price": 389.51,
    "image": "https://source.unsplash.com/random/400x400?sig=74&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "PopularFit",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743409"
  },
  {
    "id": "04f5957f-c841-46d5-857a-755efadade06",
    "title": "Mais Vendidos HypeGear #9",
    "description": "Camisa Mais Vendidos modelo HypeGear, urbana, confortável e estilosa.",
    "price": 121.52,
    "image": "https://source.unsplash.com/random/400x400?sig=76&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "HypeGear",
      "M",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "M",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743428"
  },
  {
    "id": "30aca1d0-70e8-4ca1-9c29-7e0c86643bd7",
    "title": "Mais Vendidos HypeGear #10",
    "description": "Camisa Mais Vendidos modelo HypeGear, urbana, confortável e estilosa.",
    "price": 387.8,
    "image": "https://source.unsplash.com/random/400x400?sig=78&clothes,mais vendidos",
    "category": "mais-vendidos",
    "features": [
      "Mais Vendidos",
      "HypeGear",
      "GG",
      "Masculino",
      "Urbano"
    ],
    "featured": false,
    "size": "GG",
    "isSmart": false,
    "createdAt": "2025-07-31T19:53:37.743447"
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
      const docRef = await addDoc(collection(db, "products"), product);
      console.log(`✅ Adicionado: ${product.title} (ID: ${docRef.id})`);
      added++;
    }
  }
  console.log(`🎯 Total: ${added} adicionados, ${skipped} ignorados.`);
}

setupBlasiusProducts();
