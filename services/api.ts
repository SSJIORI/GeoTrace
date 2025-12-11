import axios from 'axios';
import { LoginResponse, SearchHistoryItem, GeoData } from '../types';

// MOCK API IMPLEMENTATION (Frontend Only Mode)
// The backend requirement has been temporarily removed.
// We are using LocalStorage to simulate database operations.

const STORAGE_KEY = 'geo_trace_history';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  await delay(800); // Simulate network request
  
  // Simple mock validation
  if (email === 'test@example.com' && password === 'password123') {
    const user = { id: 'user_123', email, token: 'mock_jwt_token_' + Date.now() };
    return { user, token: user.token! };
  }
  
  // Mimic Axios error structure
  throw { 
    response: { 
      data: { 
        message: 'Invalid credentials. Try test@example.com / password123' 
      } 
    } 
  };
};

export const fetchHistory = async (): Promise<SearchHistoryItem[]> => {
  await delay(500);
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSearch = async (ip: string, geoData: GeoData): Promise<SearchHistoryItem> => {
  await delay(300);
  
  const newItem: SearchHistoryItem = {
    id: Date.now().toString() + Math.random().toString(36).substring(2),
    searched_ip: ip,
    geo_data: geoData,
    created_at: new Date().toISOString()
  };

  const currentHistory = await fetchHistory();
  // Limit history to last 50 items to prevent localStorage bloat
  const updatedHistory = [newItem, ...currentHistory].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  
  return newItem;
};

export const deleteHistory = async (ids: string[]): Promise<void> => {
  await delay(300);
  const currentHistory = await fetchHistory();
  const updatedHistory = currentHistory.filter(item => !ids.includes(item.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
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