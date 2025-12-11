export interface User {
  id: string;
  email: string;
  token?: string;
}

export interface GeoData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string; // "lat,lng"
  org?: string;
  postal?: string;
  timezone?: string;
}

export interface SearchHistoryItem {
  id: string;
  searched_ip: string;
  geo_data: GeoData;
  created_at: string;
  selected?: boolean; // UI state
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
}
