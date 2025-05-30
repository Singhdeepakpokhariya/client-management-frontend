import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';

import { getClient, createClient, updateClient, deleteClient } from '../api/clients';
import LoadingSpinner from '../components/LoadingSpinner';

// Service options
const SERVICE_OPTIONS = [
  { id: 'consultation', label: 'Consultation' },
  { id: 'strategy', label: 'Strategy Development' },
  { id: 'marketing', label: 'Marketing Campaign' },
  { id: 'design', label: 'Design Services' },
  { id: 'development', label: 'Development' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'support', label: 'Support Package' },
];

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  services: string[];
  subscriptionStart: string;
  subscriptionEnd: string;
}

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isEditMode = !!id;
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isDirty, isSubmitting }
  } = useForm<ClientFormData>();
  
  // Fetch client data if in edit mode
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id as string),
    enabled: isEditMode,
  });
  
  // Set form values when client data is loaded
  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        notes: client.notes,
        services: client.services,
        subscriptionStart: client.subscriptionStart?.split('T')[0] || '',
        subscriptionEnd: client.subscriptionEnd?.split('T')[0] || '',
      });
    }
  }, [client, reset]);
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/dashboard');
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ClientFormData) => updateClient(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      navigate(`/clients/${id}`);
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/dashboard');
    },
  });
  
  const onSubmit = (data: ClientFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  const handleDelete = () => {
    deleteMutation.mutate();
  };
  
  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(isEditMode ? `/clients/${id}` : '/dashboard')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Client' : 'Add New Client'}
        </h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Client Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('name', { required: 'Client name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Company Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    {...register('company')}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="client@example.com"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('phone', { 
                      required: 'Phone number is required',
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Services</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Services *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {SERVICE_OPTIONS.map(service => (
                    <div key={service.id} className="flex items-start">
                      <input
                        id={`service-${service.id}`}
                        type="checkbox"
                        value={service.id}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        {...register('services', { required: 'Select at least one service' })}
                      />
                      <label
                        htmlFor={`service-${service.id}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {service.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.services && (
                  <p className="mt-1 text-sm text-red-600">{errors.services.message}</p>
                )}
              </div>
            </div>
            
            {/* Subscription */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Subscription Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subscriptionStart" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    id="subscriptionStart"
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.subscriptionStart ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('subscriptionStart', { required: 'Start date is required' })}
                  />
                  {errors.subscriptionStart && (
                    <p className="mt-1 text-sm text-red-600">{errors.subscriptionStart.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subscriptionEnd" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    id="subscriptionEnd"
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.subscriptionEnd ? 'border-red-300' : 'border-gray-300'
                    }`}
                    {...register('subscriptionEnd', { required: 'End date is required' })}
                  />
                  {errors.subscriptionEnd && (
                    <p className="mt-1 text-sm text-red-600">{errors.subscriptionEnd.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Discussion Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Enter notes from client discussions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                {...register('notes')}
              ></textarea>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            {isEditMode ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Client
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting || (!isDirty && isEditMode)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle size={24} className="mr-2" />
              <h3 className="text-lg font-medium">Delete Client</h3>
            </div>
            <p className="mb-4">
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientForm;