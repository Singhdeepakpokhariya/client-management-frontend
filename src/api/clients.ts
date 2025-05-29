import axios from 'axios';
import { API_URL } from '../config';
import { Client, ClientFormData } from '../types';

// Fetch all clients
export const fetchClients = async (): Promise<Client[]> => {
  const response = await axios.get(`${API_URL}/clients`);
  return response.data;
};

// Get a single client
export const getClient = async (id: string): Promise<Client> => {
  const response = await axios.get(`${API_URL}/clients/${id}`);
  return response.data;
};

// Create a new client
export const createClient = async (clientData: ClientFormData): Promise<Client> => {
  const response = await axios.post(`${API_URL}/clients`, clientData);
  return response.data;
};

// Update a client
export const updateClient = async (id: string, clientData: ClientFormData): Promise<Client> => {
  const response = await axios.put(`${API_URL}/clients/${id}`, clientData);
  return response.data;
};

// Delete a client
export const deleteClient = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/clients/${id}`);
};

// Manual trigger Notification
export const triggerSmsReminders = async (): Promise<string> => {
  const response = await axios.post(`${API_URL}/reminders/trigger`);
  return response.data.message;
};