// src/api/mockApi.js
// This file simulates a complete backend API.
// All data is stored in memory and will reset on page refresh.

// --- BASE DE DONNÉES FACTICE ---

const DEFAULT_PRODUCTS = [
  // --- Using reliable placeholder images to prevent 404/network errors ---
  {
    id: 1,
    name: "Bleu de Chanel",
    brand: "Chanel",
    category: "Pour Homme",
    price: 410.00, // TND
    stock: 50,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=Bleu+de+Chanel",
    model3DUrl: null,
    description: "Une ode à la liberté masculine dans un aromatique-boisé au sillage captivant.",
    olfactoryNotes: { top: "Agrumes, Vétiver", middle: "Pamplemousse, Cèdre", base: "Encens, Gingembre" },
    rating: 4.8,
    isNewProduct: false,
    isBestSeller: true
  },
  {
    id: 2,
    name: "J'adore",
    brand: "Dior",
    category: "Pour Femme",
    price: 460.00, // TND
    stock: 30,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=J'adore",
    model3DUrl: null,
    description: "J'adore est le grand floral féminin de Dior.",
    olfactoryNotes: { top: "Ylang-Ylang", middle: "Rose Damascena", base: "Jasmin Sambac" },
    rating: 4.9,
    isNewProduct: false,
    isBestSeller: true
  },
  {
    id: 3,
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    category: "Niche",
    price: 740.00, // TND
    stock: 15,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=Baccarat+Rouge+540",
    model3DUrl: null,
    description: "Une signature olfactive graphique et condensée à l'extrême.",
    olfactoryNotes: { top: "Jasmin, Safran", middle: "Ambre gris", base: "Bois de cèdre" },
    rating: 5.0,
    isNewProduct: true,
    isBestSeller: false
  },
  {
    id: 4,
    name: "Aventus",
    brand: "Creed",
    category: "Pour Homme",
    price: 1050.00, // TND
    stock: 20,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=Aventus",
    model3DUrl: null,
    description: "Aventus célèbre la force, la puissance et le succès.",
    olfactoryNotes: { top: "Ananas, Cassis", middle: "Rose, Bouleau", base: "Chêne, Ambre gris" },
    rating: 4.7,
    isNewProduct: true,
    isBestSeller: false
  },
  {
    id: 5,
    name: "La Vie Est Belle",
    brand: "Lancôme",
    category: "Pour Femme",
    price: 390.00, // TND
    stock: 40,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=La+Vie+Est+Belle",
    model3DUrl: null,
    description: "Un parfum iconique, symbole du bonheur et de la féminité.",
    olfactoryNotes: { top: "Poire, Cassis", middle: "Iris, Jasmin, Fleur d'oranger", base: "Patchouli, Vanille, Fève tonka" },
    rating: 4.6,
    isNewProduct: false,
    isBestSeller: true
  },
  {
    id: 6,
    name: "Sauvage",
    brand: "Dior",
    category: "Pour Homme",
    price: 420.00, // TND
    stock: 60,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=Sauvage",
    model3DUrl: null,
    description: "Un sillage frais et puissant inspiré par les grands espaces.",
    olfactoryNotes: { top: "Bergamote de Calabre", middle: "Poivre de Sichuan", base: "Ambroxan" },
    rating: 4.8,
    isNewProduct: true,
    isBestSeller: true
  },
  {
    id: 7,
    name: "Black Opium",
    brand: "Yves Saint Laurent",
    category: "Pour Femme",
    price: 410.00, // TND
    stock: 35,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=Black+Opium",
    model3DUrl: null,
    description: "Un parfum gourmand et addictif, signature de la femme moderne.",
    olfactoryNotes: { top: "Poire, Poivre rose", middle: "Café, Fleur d'oranger", base: "Vanille, Patchouli" },
    rating: 4.7,
    isNewProduct: false,
    isBestSeller: true
  },
  {
    id: 8,
    name: "Oud Wood",
    brand: "Tom Ford",
    category: "Niche",
    price: 1200.00, // TND
    stock: 10,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=Oud+Wood",
    model3DUrl: null,
    description: "Un parfum rare et précieux, boisé et épicé.",
    olfactoryNotes: { top: "Cardamome, Bois de rose", middle: "Oud, Santal", base: "Ambre, Vanille, Fève tonka" },
    rating: 4.9,
    isNewProduct: true,
    isBestSeller: false
  },
  {
    id: 9,
    name: "L'Interdit",
    brand: "Givenchy",
    category: "Pour Femme",
    price: 370.00, // TND
    stock: 25,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=L'Interdit",
    model3DUrl: null,
    description: "Un floral blanc traversé de notes noires, interdit de résister.",
    olfactoryNotes: { top: "Fleur d'oranger, Jasmin", middle: "Tubéreuse", base: "Vétiver, Patchouli" },
    rating: 4.5,
    isNewProduct: false,
    isBestSeller: false
  },
  {
    id: 10,
    name: "Light Blue",
    brand: "Dolce & Gabbana",
    category: "Pour Femme",
    price: 350.00, // TND
    stock: 45,
    imageUrl: "https://placehold.co/500x500/E8DED2/6E5E50?text=Light+Blue",
    model3DUrl: null,
    description: "Un parfum frais et lumineux, évocateur de la Méditerranée.",
    olfactoryNotes: { top: "Citron, Pomme verte", middle: "Jasmin, Rose blanche", base: "Cèdre, Ambre" },
    rating: 4.6,
    isNewProduct: true,
    isBestSeller: false
  }
];

function loadProductsFromStorage() {
  try {
    const data = localStorage.getItem('odoriz_products');
    if (data) return JSON.parse(data);
  } catch {}
  return DEFAULT_PRODUCTS;
}

function saveProductsToStorage(products) {
  try {
    localStorage.setItem('odoriz_products', JSON.stringify(products));
  } catch {}
}

let products = loadProductsFromStorage();

let users = [
  { id: 1, email: "admin@odoriz.tn", password: "admin", role: "admin", name: "Administrateur", phone: "", addresses: [] },
  { id: 2, email: "client@test.tn", password: "password", role: "customer", name: "Walid Ben Ahmed", phone: "21 123 456", addresses: [ { id: 1, isDefault: true, fullName: "Walid Ben Ahmed (Maison)", address: "15 Rue de la Liberté", city: "Tunis", postalCode: "1001", gouvernorat: "Tunis", country: "Tunisie" } ] }
];

let orders = [
  { id: "ORD001", userId: 2, date: "2024-05-15T10:00:00Z", status: "Livrée", total: 460.00, items: [{ productId: 2, quantity: 1, price: 460.00, productName: "J'adore" }], shippingAddress: { fullName: "Walid Ben Ahmed (Maison)", address: "15 Rue de la Liberté", city: "Tunis", postalCode: "1001", gouvernorat: "Tunis", country: "Tunisie" } } // All prices in TND
];

const discounts = [
  { id: 1, code: "BIENVENUE10", type: "percentage", value: 10, isActive: true, description: "10% de réduction pour les nouveaux clients (TND)" },
  { id: 2, code: "AID50", type: "fixed", value: 50, isActive: true, description: "50 TND de réduction pour l'Aïd" }
];

const adminStats = {
  totalRevenue: 12450.00, // TND
  totalOrders: 156,
  newCustomers: 23,
  totalProducts: products.length,
  salesData: [
    { date: "2024-05-01", sales: 850 },
    { date: "2024-05-02", sales: 1200 },
    { date: "2024-05-03", sales: 950 },
    { date: "2024-05-04", sales: 1400 },
    { date: "2024-05-05", sales: 1100 },
    { date: "2024-05-06", sales: 1600 },
    { date: "2024-05-07", sales: 1350 }
  ] // All sales in TND
};

// --- API HELPER FUNCTION ---
const simulateApiCall = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data && typeof data === 'object') {
        resolve(JSON.parse(JSON.stringify(data)));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// --- EXPORTED API FUNCTIONS ---

// Product Functions
export const fetchProducts = () => simulateApiCall(products);
export const fetchProductById = (id) => simulateApiCall(products.find(p => p.id === parseInt(id)));
export const fetchBestSellers = () => simulateApiCall(products.filter(p => p.isBestSeller));
export const fetchNewProducts = () => simulateApiCall(products.filter(p => p.isNewProduct));

// Order Functions
export const fetchOrders = () => simulateApiCall(orders);
export const fetchOrderById = (id) => simulateApiCall(orders.find(o => o.id === id));
export const createOrder = (orderData) => {
  for (const item of orderData.items) {
    const productInDb = products.find(p => p.id === item.productId);
    if (productInDb) {
      if (productInDb.stock < item.quantity) { return Promise.reject(new Error(`Stock insuffisant pour ${productInDb.name}`)); }
      productInDb.stock -= item.quantity;
    }
  }
  const newOrder = { ...orderData, id: `ORD${String(orders.length + 1).padStart(3, '0')}`, date: new Date().toISOString() };
  orders.push(newOrder);
  return simulateApiCall(newOrder, 800);
};
export const updateOrderStatus = (orderId, newStatus) => {
  const order = orders.find(o => o.id === orderId);
  if (order) { order.status = newStatus; return simulateApiCall(order); }
  return simulateApiCall(null); 
};

// User Functions
export const fetchOrdersByUserId = (userId) => {
  const userOrders = orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
  return simulateApiCall(userOrders);
};
export const updateUserDetails = (userId, details) => {
  const user = users.find(u => u.id === userId);
  if (user) {
    user.name = details.name; user.email = details.email; user.phone = details.phone;
    const { password, ...userWithoutPassword } = user;
    return simulateApiCall(userWithoutPassword);
  }
  return Promise.reject(new Error("Utilisateur non trouvé"));
};
export const manageUserAddress = (userId, address) => {
  const user = users.find(u => u.id === userId);
  if (user) {
    if (address.id) {
      const index = user.addresses.findIndex(a => a.id === address.id);
      if (index > -1) user.addresses[index] = address;
    } else {
      user.addresses.push({ ...address, id: Date.now() });
    }
    return simulateApiCall(user.addresses);
  }
  return Promise.reject(new Error("Utilisateur non trouvé"));
};

// Auth Functions
export const loginUser = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) { return simulateApiCall({ user: JSON.parse(JSON.stringify(user)), token: `fake-token-${user.id}` }); }
  return simulateApiCall(null);
};

// Admin CRUD Functions
export const addProduct = (productData) => {
  const newId = Math.max(0, ...products.map(p => p.id)) + 1;
  const newProduct = { ...productData, id: newId, rating: 0 };
  products.push(newProduct);
  saveProductsToStorage(products);
  return simulateApiCall(newProduct);
};

export const updateProduct = (id, productData) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    // Prevent id overwrite
    products[index] = { ...products[index], ...productData, id: products[index].id };
    saveProductsToStorage(products);
    return simulateApiCall(products[index]);
  }
  return simulateApiCall(null);
};

export const deleteProduct = (id) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    const [deleted] = products.splice(index, 1);
    saveProductsToStorage(products);
    return simulateApiCall(deleted);
  }
  return simulateApiCall(null);
};

// Other Functions
export const fetchDiscounts = () => simulateApiCall(discounts);
export const validateDiscountCode = (code) => simulateApiCall(discounts.find(d => d.code === code && d.isActive));
export const fetchAdminStats = () => simulateApiCall(adminStats);
export const searchProducts = (query) => {
  const searchQuery = query.toLowerCase();
  const results = products.filter(p => p.name.toLowerCase().includes(searchQuery) || p.brand.toLowerCase().includes(searchQuery));
  return simulateApiCall(results);
};