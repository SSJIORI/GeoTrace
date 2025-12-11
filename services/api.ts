import axios from 'axios';
import { LoginResponse, SearchHistoryItem, GeoData } from '../types';

// API Base URL - Change this to your deployed backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    // Re-throw with consistent error structure
    throw error;
  }
};

// Fetch user's search history
export const fetchHistory = async (): Promise<SearchHistoryItem[]> => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch history:', error);
    return []; // Return empty array on error
  }
};

// Save a new search to history
export const saveSearch = async (ip: string, geoData: GeoData): Promise<SearchHistoryItem> => {
  try {
    const response = await api.post('/api/history', {
      searched_ip: ip,
      geo_data: geoData
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to save search:', error);
    // Return a local-only entry if save fails
    return {
      id: Date.now().toString(),
      searched_ip: ip,
      geo_data: geoData,
      created_at: new Date().toISOString()
    };
  }
};

// Delete search history entries
export const deleteHistory = async (ids: string[]): Promise<void> => {
  try {
    await api.delete('/api/history', { data: { ids } });
  } catch (error: any) {
    console.error('Failed to delete history:', error);
    throw error;
  }
};

// External IP Info API (Real external call)
export const fetchIpInfo = async (ip?: string): Promise<GeoData> => {
  const url = ip ? `https://ipinfo.io/${ip}/geo` : 'https://ipinfo.io/geo';
  
  try {
    const response = await axios.get<GeoData>(url);
    return response.data;
  } catch (error) {
    console.warn("IP Info fetch failed, returning mock data for demo if rate limited");
    // Fallback for demo purposes if rate limited or blocked
    return {
      ip: ip || '127.0.0.1',
      city: 'San Francisco (Mock)',
      region: 'California',
      country: 'US',
      loc: '37.7749,-122.4194',
      org: 'Demo ISP (Rate Limited)',
      timezone: 'America/Los_Angeles'
    };
  }
};