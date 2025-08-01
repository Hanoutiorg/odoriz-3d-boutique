import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fetchProducts, fetchProductById, searchProducts, fetchBestSellers, fetchNewProducts } from '../api/mockApi';

// State initial
const initialState = {
  products: [],
  bestSellers: [],
  newProducts: [],
  currentProduct: null,
  searchResults: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'name'
  }
};

// Actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_BEST_SELLERS: 'SET_BEST_SELLERS',
  SET_NEW_PRODUCTS: 'SET_NEW_PRODUCTS',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_ERROR: 'SET_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload, loading: false, error: null };
    case ACTIONS.SET_BEST_SELLERS:
      return { ...state, bestSellers: action.payload };
    case ACTIONS.SET_NEW_PRODUCTS:
      return { ...state, newProducts: action.payload };
    case ACTIONS.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload, loading: false, error: null };
    case ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload, loading: false, error: null };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Context
const ProductContext = createContext();

// Provider
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Charger tous les produits
  const loadProducts = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const products = await fetchProducts();
      dispatch({ type: ACTIONS.SET_PRODUCTS, payload: products });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Charger les meilleures ventes
  const loadBestSellers = async () => {
    try {
      const bestSellers = await fetchBestSellers();
      dispatch({ type: ACTIONS.SET_BEST_SELLERS, payload: bestSellers });
    } catch (error) {
      console.error('Erreur lors du chargement des meilleures ventes:', error);
    }
  };

  // Charger les nouveautés
  const loadNewProducts = async () => {
    try {
      const newProducts = await fetchNewProducts();
      dispatch({ type: ACTIONS.SET_NEW_PRODUCTS, payload: newProducts });
    } catch (error) {
      console.error('Erreur lors du chargement des nouveautés:', error);
    }
  };

  // Charger un produit spécifique
  const loadProduct = async (productId) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const product = await fetchProductById(productId);
      dispatch({ type: ACTIONS.SET_CURRENT_PRODUCT, payload: product });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Rechercher des produits
  const searchProductsByQuery = async (query) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const results = await searchProducts(query);
      dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Filtrer et trier les produits localement
  const getFilteredProducts = () => {
    let filtered = [...state.products];

    // Filtrer par catégorie
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    }

    // Filtrer par marque
    if (state.filters.brand) {
      filtered = filtered.filter(product => product.brand === state.filters.brand);
    }

    // Filtrer par prix
    filtered = filtered.filter(product => 
      product.price >= state.filters.minPrice && product.price <= state.filters.maxPrice
    );

    // Trier
    switch (state.filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

  // Mettre à jour les filtres
  const updateFilters = (newFilters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: newFilters });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: initialState.filters });
  };

  // Effacer les erreurs
  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  // Charger les données initiales
  useEffect(() => {
    loadProducts();
    loadBestSellers();
    loadNewProducts();
  }, []);

  const value = {
    ...state,
    loadProducts,
    loadBestSellers,
    loadNewProducts,
    loadProduct,
    searchProductsByQuery,
    getFilteredProducts,
    updateFilters,
    resetFilters,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook personnalisé
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts doit être utilisé dans un ProductProvider');
  }
  return context;
};