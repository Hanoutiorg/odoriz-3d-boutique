// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { loginUser, updateUserDetails as apiUpdateUserDetails } from '../api/mockApi';

// Initial state for the authentication context
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Actions to be dispatched
const ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
};

// Reducer function to manage state changes
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN_START:
      return { ...state, loading: true, error: null };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case ACTIONS.LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.LOGOUT:
      return { ...initialState }; // Reset to initial state on logout
    case ACTIONS.UPDATE_USER_SUCCESS:
        return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Effect to check for persisted session in localStorage on initial app load
  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('odorizUser');
        const storedToken = localStorage.getItem('odorizToken');
        if (storedUser && storedToken) {
          dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { user: JSON.parse(storedUser), token: storedToken } });
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('odorizUser');
        localStorage.removeItem('odorizToken');
    }
  }, []);

  // Login function that calls the API and dispatches actions
  const login = useCallback(async (email, password) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    try {
      const response = await loginUser(email, password);
      if (response && response.user) {
        dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: response });
        localStorage.setItem('odorizUser', JSON.stringify(response.user));
        localStorage.setItem('odorizToken', response.token);
        return { success: true };
      } else {
        const errorMsg = 'Email ou mot de passe incorrect';
        dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: errorMsg });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: err.message });
      return { success: false, error: err.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    dispatch({ type: ACTIONS.LOGOUT });
    localStorage.removeItem('odorizUser');
    localStorage.removeItem('odorizToken');
  }, []);

  // Function to update user profile details
  const updateUser = useCallback(async (details) => {
      if (!state.user) return;
      try {
          const updatedUser = await apiUpdateUserDetails(state.user.id, details);
          dispatch({ type: ACTIONS.UPDATE_USER_SUCCESS, payload: updatedUser });
          localStorage.setItem('odorizUser', JSON.stringify(updatedUser));
          return updatedUser;
      } catch (error) {
          console.error("Failed to update user details:", error);
          throw error;
      }
  }, [state.user]);

  // Helper function to check if the user is an admin
  const isAdmin = useCallback(() => {
    return state.isAuthenticated && state.user?.role === 'admin';
  }, [state.isAuthenticated, state.user]);

  // The value provided to consuming components
  const value = {
    ...state,
    login,
    logout,
    updateUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};