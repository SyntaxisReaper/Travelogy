import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, ConsentStatus, User } from '../types/auth';
import { API_BASE_URL, DEMO_MODE } from '../config/env';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await api.post('/auth/token/refresh/', {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post('/auth/login/', credentials).then(res => res.data),
    
  register: (userData: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register/', userData).then(res => res.data),
    
  logout: (data: { refresh_token: string }) =>
    api.post('/auth/logout/', data).then(res => res.data),
    
  getProfile: (): Promise<User> =>
    api.get('/auth/profile/').then(res => res.data),
    
  updateProfile: (data: Partial<User>): Promise<User> =>
    api.patch('/auth/profile/', data).then(res => res.data),
    
  checkConsent: (): Promise<ConsentStatus> =>
    api.get('/auth/consent/check/').then(res => res.data),
    
  updateConsent: (consentData: any) =>
    api.post('/auth/consent/', consentData).then(res => res.data),
};

// Trips API
export const tripsAPI = {
  getTrips: async (params?: unknown) => {
    if (DEMO_MODE) {
      return {
        results: [
          { id: 't1', start_time: new Date(Date.now()-86400000).toISOString(), end_time: new Date().toISOString(), transport_mode: 'walk', distance_km: 3.2, diary_entries: [], path: [[20,77],[20.1,77.1]] },
          { id: 't2', start_time: new Date(Date.now()-172800000).toISOString(), end_time: new Date(Date.now()-172000000).toISOString(), transport_mode: 'car', distance_km: 15.4, diary_entries: [], path: [[20.2,77.3],[20.25,77.35]] },
        ]
      };
    }
    return api.get('/trips/', { params }).then(res => res.data);
  },
    
  getTripById: async (id: string) => {
    if (DEMO_MODE) {
      return {
        id,
        path: [[20,77],[20.1,77.1],[20.12,77.12]],
        diaries: [
          { id: 'd1', note: 'Beautiful walk through the park', photos: [], created_at: new Date().toISOString() },
        ],
      };
    }
    return api.get(`/trips/${id}/`).then(res => res.data);
  },
    
  createTrip: (tripData: unknown) =>
    api.post('/trips/', tripData).then(res => res.data),
    
  updateTrip: (id: string, tripData: unknown) =>
    api.patch(`/trips/${id}/`, tripData).then(res => res.data),
    
  deleteTrip: (id: string) =>
    api.delete(`/trips/${id}/`).then(res => res.data),
    
  startTrip: (tripData: unknown) =>
    api.post('/trips/start/', tripData).then(res => res.data),
    
  completeTrip: (id: string, completionData: unknown) =>
    api.post(`/trips/${id}/complete/`, completionData).then(res => res.data),
    
  addDiary: (id: string, note: string, files: File[], captions?: (string | undefined)[]) => {
    const form = new FormData();
    form.append('note', note);
    files.forEach((f) => form.append('photos', f));
    if (captions && captions.length) {
      form.append('captions', JSON.stringify(captions));
    }
    return api.post(`/trips/${id}/diary/`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data);
  },
  addDiaryUrls: (id: string, note: string, photos: Array<string | { url: string; caption?: string }>) =>
    api.post(`/trips/${id}/diary/urls/`, { note, photos }).then(res => res.data),
    
  getActiveTrip: () =>
    api.get('/trips/active/').then(res => res.data),
    
  getStats: async () => {
    if (DEMO_MODE) {
      return { total_trips: 12, total_distance: 124.3, eco_score: 82, trips_this_week: 3, mode_breakdown: { walk: 6, car: 3, bus: 2, cycle: 1 } };
    }
    return api.get('/trips/stats/').then(res => res.data);
  },
    
  getTimeline: async (params?: unknown) => {
    if (DEMO_MODE) {
      return [
        { id: 'd1', note: 'Great coffee by the lake', created_at: new Date(Date.now()-3600000).toISOString(), photos: [] },
        { id: 'd2', note: 'Train ride was smooth', created_at: new Date(Date.now()-7200000).toISOString(), photos: [] },
      ];
    }
    return api.get('/trips/timeline/', { params }).then(res => res.data);
  },
    
  getHeatmap: async () => {
    if (DEMO_MODE) {
      return [
        { lat: 20.0, lon: 77.0, weight: 1 },
        { lat: 20.2, lon: 77.3, weight: 2 },
      ];
    }
    return api.get('/trips/heatmap/').then(res => res.data);
  },
    
  predictTrip: (data: unknown) =>
    api.post('/trips/predict/', data).then(res => res.data),
  updateDiary: (tripId: string, entryId: string, payload: { note?: string; photos?: string[] }) =>
    api.patch(`/trips/${tripId}/diary/${entryId}/`, payload).then(res => res.data),
  deleteDiary: (tripId: string, entryId: string) =>
    api.delete(`/trips/${tripId}/diary/${entryId}/`).then(res => res.data),
};

// Bookings API (hotels and trains)
export const bookingsAPI = {
  searchHotels: async (params: { city?: string; check_in?: string; check_out?: string; guests?: number; provider?: string; rooms?: number; adults?: number; children?: number }) => {
    if (DEMO_MODE) {
      return [
        { id: 'h1', name: 'Neon Plaza', price: 120, rating: 4.5, address: 'Central City' },
        { id: 'h2', name: 'Quantum Suites', price: 180, rating: 4.8, address: 'Downtown' },
      ];
    }
    return api.get('/bookings/hotels/search/', { params }).then(res => res.data);
  },
  bookHotel: (data: unknown) =>
    api.post('/bookings/hotels/', data).then(res => res.data),
  searchTrains: async (params: { from?: string; to?: string; date?: string; class?: string; provider?: string; passengers?: number }) => {
    if (DEMO_MODE) {
      return [
        { id: 't101', name: 'Express 101', departure: '10:30', arrival: '12:10', class: 'AC Chair', price: 25 },
        { id: 't202', name: 'Regional 202', departure: '14:15', arrival: '17:00', class: 'Sleeper', price: 15 },
      ];
    }
    return api.get('/bookings/trains/search/', { params }).then(res => res.data);
  },
  bookTrain: (data: unknown) =>
    api.post('/bookings/trains/', data).then(res => res.data),
  getReservations: async () => {
    if (DEMO_MODE) {
      return [
        { id: 'r1', type: 'hotel', name: 'Neon Plaza', date: new Date().toISOString(), meta: { nights: 2 } },
        { id: 'r2', type: 'train', name: 'Express 101', date: new Date().toISOString(), meta: { from: 'City A', to: 'City B' } },
      ];
    }
    return api.get('/bookings/reservations/').then(res => res.data);
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () =>
    api.get('/analytics/dashboard/').then(res => res.data),
};

// Emergency API
export const emergencyAPI = {
  sendReport: (data: unknown) =>
    api.post('/emergency/report/', data).then(res => res.data),
};

// Gamification API
export const gamificationAPI = {
  getProfile: () =>
    api.get('/gamification/profile/').then(res => res.data),
    
  getLeaderboard: () =>
    api.get('/gamification/leaderboard/').then(res => res.data),
};


// Stores API (local stores / groceries)
export const storesAPI = {
  getStores: async (params?: { q?: string }) => {
    if (DEMO_MODE) {
      return [
        { id: 's1', name: 'City Mart', items: [ { id: 'i1', name: 'Apples (1kg)', price: 3.5 }, { id: 'i2', name: 'Milk (1L)', price: 1.2 } ] },
        { id: 's2', name: 'Green Grocer', items: [ { id: 'i3', name: 'Bananas (1kg)', price: 2.8 }, { id: 'i4', name: 'Bread', price: 1.0 } ] },
      ];
    }
    return api.get('/stores/', { params }).then(res => res.data);
  },
  checkout: async (payload: { items: Array<{ store_id: string; item_id: string; qty: number }> }) => {
    if (DEMO_MODE) {
      return { status: 'ok', order_id: 'demo-order-1' };
    }
    return api.post('/stores/checkout/', payload).then(res => res.data);
  }
};

export default api;
