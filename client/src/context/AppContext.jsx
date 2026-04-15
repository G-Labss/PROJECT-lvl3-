import React, { createContext, useReducer, useEffect } from 'react';
import { lessonAPI, userAPI, authAPI } from '../services/api';

const parseStoredAuth = () => {
  try {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const AppContext = createContext();

const initialState = {
  lessons: [],
  users: [],
  currentUser: null,
  isAuthenticated: !!localStorage.getItem('token'),
  authUser: parseStoredAuth(), // { role, name, email }
  loading: false,
  error: null,
};

const ACTIONS = {
  SET_LESSONS: 'SET_LESSONS',
  ADD_LESSON: 'ADD_LESSON',
  UPDATE_LESSON: 'UPDATE_LESSON',
  DELETE_LESSON: 'DELETE_LESSON',
  SET_USERS: 'SET_USERS',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
};

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LESSONS:
      return { ...state, lessons: action.payload, loading: false, error: null };

    case ACTIONS.ADD_LESSON:
      return { ...state, lessons: [action.payload, ...state.lessons], loading: false };

    case ACTIONS.UPDATE_LESSON:
      return {
        ...state,
        lessons: state.lessons.map(l => l._id === action.payload._id ? action.payload : l),
        loading: false,
      };

    case ACTIONS.DELETE_LESSON:
      return {
        ...state,
        lessons: state.lessons.filter(l => l._id !== action.payload),
        loading: false,
      };

    case ACTIONS.SET_USERS:
      return { ...state, users: action.payload, loading: false };

    case ACTIONS.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ACTIONS.LOGIN:
      return { ...state, isAuthenticated: true, authUser: action.payload };

    case ACTIONS.LOGOUT:
      return { ...state, isAuthenticated: false, authUser: null };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    fetchLessons();
    fetchUsers();
  }, []);

  const fetchLessons = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await lessonAPI.getAll();
      dispatch({ type: ACTIONS.SET_LESSONS, payload: response.data || [] });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_LESSONS, payload: [] });
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      const users = response.data || [];
      dispatch({ type: ACTIONS.SET_USERS, payload: users });
      const coach = users.find(u => u.ntrpRating != null) || users[0] || null;
      dispatch({ type: ACTIONS.SET_CURRENT_USER, payload: coach });
    } catch {
      dispatch({ type: ACTIONS.SET_USERS, payload: [] });
    }
  };

  const updateServiceArea = async (serviceArea) => {
    const coach = state.currentUser;
    if (!coach) return;
    const response = await userAPI.updateServiceArea(coach._id, serviceArea);
    dispatch({ type: ACTIONS.SET_CURRENT_USER, payload: response.data });
  };

  const _storeAuth = (response) => {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    const authUser = { role: response.role, name: response.name, email: response.email };
    localStorage.setItem('authUser', JSON.stringify(authUser));
    dispatch({ type: ACTIONS.LOGIN, payload: authUser });
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    _storeAuth(response);
    return response;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    _storeAuth(response);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  const addLesson = async (lessonData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await lessonAPI.create(lessonData);
      dispatch({ type: ACTIONS.ADD_LESSON, payload: response.data });
      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateLesson = async (id, lessonData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await lessonAPI.update(id, lessonData);
      dispatch({ type: ACTIONS.UPDATE_LESSON, payload: response.data });
      return response;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteLesson = async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await lessonAPI.delete(id);
      dispatch({ type: ACTIONS.DELETE_LESSON, payload: id });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const value = {
    state,
    fetchLessons,
    login,
    register,
    logout,
    addLesson,
    updateLesson,
    deleteLesson,
    updateServiceArea,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// useAppContext hook lives in useAppContext.js — keeps this file
// component-only so Vite Fast Refresh works without invalidating the whole tree.
