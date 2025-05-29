// Client Types
export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  services: string[];
  subscriptionStart: string;
  subscriptionEnd: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  services: string[];
  subscriptionStart: string;
  subscriptionEnd: string;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}