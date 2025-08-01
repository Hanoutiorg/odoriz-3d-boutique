import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loginUser } from '../api/mockApi';
import { toast } from '@/hooks/use-toast';

// État initial
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

// Actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case ACTIONS.LOGOUT:
      return initialState;
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const savedAuth = localStorage.getItem('odoriz-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        // Vérifier si le token n'est pas expiré (simulation simple)
        const tokenAge = Date.now() - authData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 heures
        
        if (tokenAge < maxAge) {
          dispatch({
            type: ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: authData.user,
              token: authData.token
            }
          });
        } else {
          // Token expiré
          localStorage.removeItem('odoriz-auth');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'authentification:', error);
        localStorage.removeItem('odoriz-auth');
      }
    }
  }, []);

  // Connexion
  const login = async (email, password) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const authData = await loginUser(email, password);
      
      if (authData) {
        // Sauvegarder dans localStorage
        const authToSave = {
          user: authData.user,
          token: authData.token,
          timestamp: Date.now()
        };
        localStorage.setItem('odoriz-auth', JSON.stringify(authToSave));
        
        dispatch({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: authData
        });

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${authData.user.name} !`,
          duration: 3000,
        });

        return { success: true };
      } else {
        dispatch({
          type: ACTIONS.LOGIN_ERROR,
          payload: 'Email ou mot de passe incorrect'
        });
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }
    } catch (error) {
      dispatch({
        type: ACTIONS.LOGIN_ERROR,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('odoriz-auth');
    dispatch({ type: ACTIONS.LOGOUT });
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
      duration: 3000,
    });
  };

  // Effacer les erreurs
  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return state.user && state.user.role === 'admin';
  };

  // Vérifier si l'utilisateur est client
  const isCustomer = () => {
    return state.user && state.user.role === 'customer';
  };

  // Fonction pour vérifier l'autorisation d'accès à une route
  const hasAccess = (requiredRole) => {
    if (!state.isAuthenticated) return false;
    if (!requiredRole) return true; // Pas de rôle requis
    return state.user && state.user.role === requiredRole;
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    isAdmin,
    isCustomer,
    hasAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};