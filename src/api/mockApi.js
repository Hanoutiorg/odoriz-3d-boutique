// API Factice pour Odoriz Parfums
// Simule une base de données et des appels réseau asynchrones

// --- BASE DE DONNÉES FACTICE ---

const products = [
  {
    id: 1,
    name: "Bleu de Chanel",
    brand: "Chanel",
    category: "Pour Homme",
    price: 125.00,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=600&fit=crop",
    model3DUrl: "/models/bleu-de-chanel.glb",
    description: "Une ode à la liberté masculine dans un aromatique-boisé au sillage captivant. Un parfum intemporel, dans un flacon d'un bleu profond et mystérieux.",
    olfactoryNotes: {
      top: "Agrumes, Vétiver, Baies roses",
      middle: "Pamplemousse, Cèdre, Labdanum",
      base: "Encens, Gingembre, Bois de santal"
    },
    rating: 4.8,
    isNewProduct: false,
    isBestSeller: true
  },
  {
    id: 2,
    name: "J'adore",
    brand: "Dior",
    category: "Pour Femme",
    price: 140.00,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=500&h=600&fit=crop",
    model3DUrl: "/models/jadore.glb",
    description: "J'adore est le grand floral féminin de Dior. Un bouquet façonné au détail près, comme une fleur sur mesure. L'essence d'Ylang-Ylang des Comores déploie ses notes fleuries-fruitées et exhale une douceur exotique.",
    olfactoryNotes: {
      top: "Ylang-Ylang",
      middle: "Rose Damascena",
      base: "Jasmin Sambac et Jasmin de Grasse"
    },
    rating: 4.9,
    isNewProduct: false,
    isBestSeller: true
  },
  {
    id: 3,
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    category: "Niche",
    price: 225.00,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=600&fit=crop",
    model3DUrl: "/models/baccarat-rouge.glb",
    description: "Une signature olfactive graphique et condensée à l'extrême. Baccarat Rouge 540 se pose sur la peau tel un souffle fleuri, ambré et boisé. Une alchimie poétique.",
    olfactoryNotes: {
      top: "Jasmin, Safran",
      middle: "Ambre gris",
      base: "Bois de cèdre, Résine de sapin"
    },
    rating: 5.0,
    isNewProduct: true,
    isBestSeller: false
  },
  {
    id: 4,
    name: "Aventus",
    brand: "Creed",
    category: "Pour Homme",
    price: 320.00,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&h=600&fit=crop",
    model3DUrl: "/models/aventus.glb",
    description: "Aventus célèbre la force, la puissance et le succès. Inspiré des vies dramatiques d'empereurs historiques, ce parfum offre une vision de l'homme audacieux d'aujourd'hui.",
    olfactoryNotes: {
      top: "Ananas, Cassis, Pomme verte, Bergamote",
      middle: "Rose, Bouleau, Patchouli, Jasmin marocain",
      base: "Chêne, Ambre gris, Musc, Vanille"
    },
    rating: 4.7,
    isNewProduct: true,
    isBestSeller: false
  },
  {
    id: 5,
    name: "La Vie Est Belle",
    brand: "Lancôme",
    category: "Pour Femme",
    price: 95.00,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0d62fc93b92?w=500&h=600&fit=crop",
    model3DUrl: "/models/la-vie-est-belle.glb",
    description: "La Vie Est Belle incarne un nouveau parfum du bonheur. Une fragrance unique créée pour faire de la vie un rêve, et d'un rêve, une réalité.",
    olfactoryNotes: {
      top: "Cassis, Poire",
      middle: "Iris, Jasmin, Fleur d'oranger",
      base: "Praline, Vanille, Patchouli, Bois de santal"
    },
    rating: 4.6,
    isNewProduct: false,
    isBestSeller: true
  },
  {
    id: 6,
    name: "Tom Ford Black Orchid",
    brand: "Tom Ford",
    category: "Niche",
    price: 180.00,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1557170334-a9632ee7d1d4?w=500&h=600&fit=crop",
    model3DUrl: "/models/black-orchid.glb",
    description: "Black Orchid de Tom Ford est un parfum de luxe moderne, à la fois glamour et sophistiqué. Une fragrance riche et sensuelle qui dévoile la dualité de l'orchidée noire.",
    olfactoryNotes: {
      top: "Truffe, Ylang-Ylang, Cassis, Bergamote",
      middle: "Orchidée noire, Épices, Fruits",
      base: "Patchouli, Vanille, Encens, Bois de santal"
    },
    rating: 4.8,
    isNewProduct: false,
    isBestSeller: false
  }
];

const users = [
  { id: 1, email: "admin@odoriz.fr", password: "admin", role: "admin", name: "Administrateur" },
  { id: 2, email: "client@test.fr", password: "password", role: "customer", name: "Client Test" }
];

const orders = [
  { 
    id: "ORD001", 
    userId: 2, 
    date: "2024-01-15T10:00:00Z", 
    status: "Expédiée", 
    total: 125.00, 
    items: [{ productId: 1, quantity: 1, price: 125.00, productName: "Bleu de Chanel" }],
    shippingAddress: "123 Rue de la Paix, Paris"
  },
  { 
    id: "ORD002", 
    userId: 2, 
    date: "2024-01-10T14:30:00Z", 
    status: "Livrée", 
    total: 365.00, 
    items: [
      { productId: 2, quantity: 1, price: 140.00, productName: "J'adore" },
      { productId: 3, quantity: 1, price: 225.00, productName: "Baccarat Rouge 540" }
    ],
    shippingAddress: "456 Avenue des Champs, Lyon"
  }
];

const discounts = [
  { 
    id: 1,
    code: "BIENVENUE10", 
    type: "percentage", 
    value: 10, 
    isActive: true,
    description: "Code de bienvenue - 10% de réduction"
  },
  { 
    id: 2,
    code: "SOLDE20", 
    type: "percentage", 
    value: 20, 
    isActive: false,
    description: "Soldes d'hiver - 20% de réduction"
  },
  { 
    id: 3,
    code: "NOEL50", 
    type: "fixed", 
    value: 50, 
    isActive: true,
    description: "Offre spéciale Noël - 50€ de réduction"
  }
];

// Statistiques pour le dashboard admin
const adminStats = {
  totalRevenue: 12450.00,
  totalOrders: 156,
  newCustomers: 23,
  totalProducts: products.length,
  salesData: [
    { date: "2024-01-01", sales: 850 },
    { date: "2024-01-02", sales: 1200 },
    { date: "2024-01-03", sales: 950 },
    { date: "2024-01-04", sales: 1400 },
    { date: "2024-01-05", sales: 1100 },
    { date: "2024-01-06", sales: 1600 },
    { date: "2024-01-07", sales: 1350 }
  ]
};

// --- FONCTIONS API (Simulation des appels réseau) ---

const simulateApiCall = (data, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.95) { // 5% de chance d'erreur pour simulation réaliste
        reject(new Error("Erreur de connexion"));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Gestion des produits
export const fetchProducts = () => simulateApiCall(products);
export const fetchProductById = (id) => {
  const product = products.find(p => p.id === parseInt(id));
  return simulateApiCall(product);
};
export const fetchBestSellers = () => {
  const bestSellers = products.filter(p => p.isBestSeller);
  return simulateApiCall(bestSellers);
};
export const fetchNewProducts = () => {
  const newProducts = products.filter(p => p.isNewProduct);
  return simulateApiCall(newProducts);
};
export const fetchProductsByCategory = (category) => {
  const filtered = products.filter(p => p.category === category);
  return simulateApiCall(filtered);
};

// Gestion des commandes
export const fetchOrders = () => simulateApiCall(orders);
export const fetchOrderById = (id) => {
  const order = orders.find(o => o.id === id);
  return simulateApiCall(order);
};
export const updateOrderStatus = (orderId, newStatus) => {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    return simulateApiCall(order);
  }
  return simulateApiCall(null);
};
export const createOrder = (orderData) => {
  const newOrder = {
    ...orderData,
    id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString()
  };
  orders.push(newOrder);
  return simulateApiCall(newOrder);
};

// Gestion des utilisateurs et authentification
export const loginUser = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return simulateApiCall({
      user: userWithoutPassword,
      token: `fake-token-${user.id}-${Date.now()}`
    });
  }
  return simulateApiCall(null);
};

// Gestion des réductions
export const fetchDiscounts = () => simulateApiCall(discounts);
export const validateDiscountCode = (code) => {
  const discount = discounts.find(d => d.code === code && d.isActive);
  return simulateApiCall(discount);
};

// CRUD Produits (Admin)
export const addProduct = (productData) => {
  const newProduct = { 
    ...productData, 
    id: Math.max(...products.map(p => p.id)) + 1,
    rating: 0,
    isNewProduct: true,
    isBestSeller: false
  };
  products.push(newProduct);
  return simulateApiCall(newProduct);
};

export const updateProduct = (id, productData) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...productData };
    return simulateApiCall(products[index]);
  }
  return simulateApiCall(null);
};

export const deleteProduct = (id) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    const deletedProduct = products.splice(index, 1)[0];
    return simulateApiCall(deletedProduct);
  }
  return simulateApiCall(null);
};

// Statistiques Admin
export const fetchAdminStats = () => simulateApiCall(adminStats);

// Recherche
export const searchProducts = (query) => {
  const searchQuery = query.toLowerCase();
  const results = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery) ||
    p.brand.toLowerCase().includes(searchQuery) ||
    p.description.toLowerCase().includes(searchQuery)
  );
  return simulateApiCall(results);
};