import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Client } from '../types';

interface ClientCardProps {
  client: Client;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
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

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const daysLeft = daysUntil(client.subscriptionEnd);
  
  return (
    <Link 
      to={`/clients/${client._id}`}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            {client.company && (
              <p className="text-sm text-gray-600">{client.company}</p>
            )}
          </div>
          
          {daysLeft <= 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Expired
            </span>
          ) : daysLeft <= 7 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {daysLeft} days
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          )}
        </div>
        
        <div className="flex flex-col space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span>
              Ends: {formatDate(client.subscriptionEnd)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span>
              {daysLeft <= 0 ? 'Subscription expired' : `${daysLeft} days remaining`}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {client.services.slice(0, 3).map((service, index) => (
            <span 
              key={index} 
              className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {service.charAt(0).toUpperCase() + service.slice(1)}
            </span>
          ))}
          {client.services.length > 3 && (
            <span className="inline-block px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full">
              +{client.services.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ClientCard;