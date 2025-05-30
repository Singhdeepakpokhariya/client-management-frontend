import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, RefreshCw, AlertCircle,Bell } from 'lucide-react';
import { fetchClients, triggerSmsReminders } from '../api/clients';
import ClientCard from '../components/ClientCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
 
 const {user} = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['clients',user?.id],
    queryFn: fetchClients
  });

  const filteredClients = data?.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );
    // Create mutation
  const createSmsReminders  = useMutation({
    mutationFn: triggerSmsReminders ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smsRemainder'] });
    },
  });
  console.log("user",user);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Client Dashboard</h1>
        
        <div className="flex space-x-2">
             <button 
            onClick={()=>createSmsReminders.mutate()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Bell size={16} className="mr-2" />
            Send Remainder 
          </button>
          <Link 
            to="/clients/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Client
          </Link>
          
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search clients..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size={40} />
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading clients</h3>
            <div className="mt-1 text-sm text-red-700">
              {(error as Error)?.message || 'Please try again or contact support.'}
            </div>
            <button 
              onClick={() => refetch()} 
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Try again
            </button>
          </div>
        </div>
      ) : filteredClients?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
          {searchTerm ? (
            <p className="text-gray-500 mb-4">Try a different search or clear the search field.</p>
          ) : (
            <p className="text-gray-500 mb-4">Get started by adding your first client.</p>
          )}
          
          {!searchTerm && (
            <Link 
              to="/clients/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Add Client
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients?.map((client) => (
            <ClientCard key={client._id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;