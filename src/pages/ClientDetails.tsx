import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Edit, Calendar, Phone, Mail, Building, Clock, ArrowLeft } from 'lucide-react';
import { getClient } from '../api/clients';
import LoadingSpinner from '../components/LoadingSpinner';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const daysUntil = (dateString: string) => {
  if (!dateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: client, isLoading, isError, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id as string),
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800">Error loading client</h3>
          <div className="mt-2 text-sm text-red-700">
            {(error as Error).message || 'Unable to load client details. Please try again.'}
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-yellow-800">Client not found</h3>
          <div className="mt-2 text-sm text-yellow-700">
            The client you're looking for doesn't exist or has been removed.
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-3 text-sm font-medium text-yellow-600 hover:text-yellow-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const daysLeft = daysUntil(client.subscriptionEnd);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-grow">Client Details</h1>
        <Link
          to={`/clients/${id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Edit size={16} className="mr-2" />
          Edit Client
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{client.name}</h2>
              {client.company && (
                <div className="flex items-center mt-1 text-gray-600">
                  <Building size={16} className="mr-1" />
                  <span>{client.company}</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 md:mt-0">
              {daysLeft <= 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Subscription Expired
                </span>
              ) : daysLeft <= 7 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Expires in {daysLeft} days
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active Subscription
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              
              <div className="flex items-center">
                <Mail size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-900">{client.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-900">{client.phone}</span>
              </div>
            </div>
            
            {/* Subscription Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Subscription Details</h3>
              
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-900">
                  {formatDate(client.subscriptionStart)} - {formatDate(client.subscriptionEnd)}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-900">
                  {daysLeft <= 0 
                    ? 'Subscription has expired' 
                    : `${daysLeft} days remaining`}
                </span>
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Services</h3>
            <div className="flex flex-wrap gap-2">
              {client.services.map(service => (
                <span 
                  key={service}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {service.charAt(0).toUpperCase() + service.slice(1)}
                </span>
              ))}
            </div>
          </div>
          
          {/* Notes */}
          {client.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Discussion Notes</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700 whitespace-pre-line">{client.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;