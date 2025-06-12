import { User } from "@/services/api";

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserData = (): User | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && localStorage.getItem('isLoggedIn') === 'true';
};

export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
};