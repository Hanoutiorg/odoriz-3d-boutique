import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { fetchProducts, fetchProductById } from '../api/mockApi';

// Initial state for the context
const initialState = {
  products: [],
  filteredProducts: [],
  bestSellers: [],
  newProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 500,
    sortBy: 'name',
  },
};

// All possible actions that can be dispatched to the reducer
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  SET_ERROR: 'SET_ERROR',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  REMOVE_PRODUCT: 'REMOVE_PRODUCT',
  SET_FILTERED_PRODUCTS: 'SET_FILTERED_PRODUCTS',
};

// The reducer function that handles state updates based on actions
const productReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload, // Initially, the filtered list is the full list
        bestSellers: action.payload.filter(p => p.isBestSeller),
        newProducts: action.payload.filter(p => p.isNewProduct),
        loading: false,
      };
    case ACTIONS.SET_CURRENT_PRODUCT:
      return { ...state, currentProduct: action.payload, loading: false };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        filteredProducts: [...state.products, action.payload], // Also add to filtered list
      };
    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
        filteredProducts: state.filteredProducts.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case ACTIONS.REMOVE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
        filteredProducts: state.filteredProducts.filter(p => p.id !== action.payload),
      };
    case ACTIONS.SET_FILTERED_PRODUCTS:
      return {
        ...state,
        filteredProducts: action.payload,
      };
    default:
      return state;
  }
};

// Create the context
const ProductContext = createContext();


// Provider Component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const [filters, setFilters] = React.useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 500,
    sortBy: 'name',
  });

  const loadProducts = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const productsData = await fetchProducts();
      dispatch({ type: ACTIONS.SET_PRODUCTS, payload: productsData });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const loadProduct = useCallback(async (productId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      let product = state.products.find(p => p.id === parseInt(productId));
      if (!product) {
        product = await fetchProductById(productId);
      }
      if (!product) {
        throw new Error("Product not found in state or API");
      }
      dispatch({ type: ACTIONS.SET_CURRENT_PRODUCT, payload: product });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.products]);

  // CRUD functions that dispatch actions to the reducer
  const addProductToState = useCallback((product) => dispatch({ type: ACTIONS.ADD_PRODUCT, payload: product }), []);
  const updateProductInState = useCallback((product) => dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: product }), []);
  const removeProductFromState = useCallback((productId) => dispatch({ type: ACTIONS.REMOVE_PRODUCT, payload: productId }), []);

  // Search function that filters the master list and updates the filtered list
  const searchProductsByQuery = useCallback((query) => {
    if (!query) {
      dispatch({ type: ACTIONS.SET_FILTERED_PRODUCTS, payload: state.products });
      return;
    }
    const lowercasedQuery = query.toLowerCase();
    const results = state.products.filter(p => 
      p.name.toLowerCase().includes(lowercasedQuery) ||
      p.brand.toLowerCase().includes(lowercasedQuery)
    );
    dispatch({ type: ACTIONS.SET_FILTERED_PRODUCTS, payload: results });
  }, [state.products]);

  // Filtering, sorting, and helpers for catalogue
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  const resetFilters = () => {
    setFilters({ category: '', brand: '', minPrice: 0, maxPrice: 500, sortBy: 'name' });
  };
  const getFilteredProducts = () => {
    let filtered = [...state.products];
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.brand) filtered = filtered.filter(p => p.brand === filters.brand);
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price); break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest':
        filtered.sort((a, b) => (b.isNewProduct ? 1 : 0) - (a.isNewProduct ? 1 : 0)); break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return filtered;
  };

  const value = {
    ...state,
    filters,
    updateFilters,
    resetFilters,
    getFilteredProducts,
    loadProducts,
    loadProduct,
    addProductToState,
    updateProductInState,
    removeProductFromState,
    searchProductsByQuery,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom Hook to consume the context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};