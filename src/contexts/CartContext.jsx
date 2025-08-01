import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// État initial du panier
const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isOpen: false
};

// Actions
const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS'
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Mise à jour de la quantité si le produit existe déjà
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        // Ajout d'un nouveau produit
        const newItem = { ...action.payload, quantity: 1 };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case ACTIONS.REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: updatedItems };
    }

    case ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Supprimer l'article si la quantité est 0 ou négative
        const updatedItems = state.items.filter(item => item.id !== productId);
        return { ...state, items: updatedItems };
      }
      
      const updatedItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      return { ...state, items: updatedItems };
    }

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [], totalAmount: 0, totalItems: 0 };

    case ACTIONS.TOGGLE_CART:
      return { ...state, isOpen: !state.isOpen };

    case ACTIONS.CALCULATE_TOTALS: {
      const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...state,
        totalItems,
        totalAmount: Math.round(totalAmount * 100) / 100 // Arrondir à 2 décimales
      };
    }

    default:
      return state;
  }
};

// Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Calculer les totaux à chaque changement des items
  useEffect(() => {
    dispatch({ type: ACTIONS.CALCULATE_TOTALS });
  }, [state.items]);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('odoriz-cart', JSON.stringify(state.items));
  }, [state.items]);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('odoriz-cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        items.forEach(item => {
          dispatch({ type: ACTIONS.ADD_TO_CART, payload: item });
        });
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        localStorage.removeItem('odoriz-cart');
      }
    }
  }, []);

  // Ajouter un produit au panier
  const addToCart = (product) => {
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: product });
    
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
      duration: 3000,
    });
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId) => {
    const item = state.items.find(item => item.id === productId);
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
    
    if (item) {
      toast({
        title: "Produit supprimé",
        description: `${item.name} a été supprimé de votre panier`,
        duration: 3000,
      });
    }
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { productId, quantity } });
  };

  // Vider le panier
  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
    toast({
      title: "Panier vidé",
      description: "Tous les produits ont été supprimés de votre panier",
      duration: 3000,
    });
  };

  // Ouvrir/fermer le panier
  const toggleCart = () => {
    dispatch({ type: ACTIONS.TOGGLE_CART });
  };

  // Obtenir la quantité d'un produit spécifique dans le panier
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Vérifier si un produit est dans le panier
  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  // Calculer les frais de port (simulation)
  const getShippingCost = () => {
    if (state.totalAmount >= 100) {
      return 0; // Livraison gratuite à partir de 100€
    }
    return 8.90; // Frais de port standard
  };

  // Calculer le total final avec frais de port
  const getFinalTotal = () => {
    return state.totalAmount + getShippingCost();
  };

  // Appliquer un code de réduction (simulation)
  const applyDiscount = (discountCode, discountValue, discountType) => {
    let discountAmount = 0;
    
    if (discountType === 'percentage') {
      discountAmount = (state.totalAmount * discountValue) / 100;
    } else if (discountType === 'fixed') {
      discountAmount = Math.min(discountValue, state.totalAmount);
    }
    
    return {
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalTotal: Math.max(0, getFinalTotal() - discountAmount)
    };
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getItemQuantity,
    isInCart,
    getShippingCost,
    getFinalTotal,
    applyDiscount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};