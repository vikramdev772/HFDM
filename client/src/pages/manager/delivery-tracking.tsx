import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Search, Clock, MapPin, User, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

interface Delivery {
  id: number;
  patient: string;
  room: string;
  meal: string;
  items: string[];
  status: 'Delivered' | 'In Transit' | 'Preparing';
  deliveryTime: string;
  assignedTo: string;
}

type StatusFilter = 'all' | 'preparing' | 'in-transit' | 'delivered';

const ErrorSection = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-red-50 rounded-lg">
    <p className="text-red-600 text-center">{message}</p>
    <Button variant="outline" size="sm" onClick={onRetry}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Retry
    </Button>
  </div>
);

export default function DeliveryTracking() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const { toast } = useToast();

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('https://hfdm.onrender.com/api/manager/deliveries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Delivery tracking endpoint not found. Please check the API configuration.');
        }
        throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDeliveries(data);
    } catch (err) {
      const message = err instanceof Error 
        ? err.message 
        : 'Unable to connect to the delivery tracking service. Please try again later.';
      setError(message);
      // Use mock data when API fails in development
      if (process.env.NODE_ENV === 'development') {
        setDeliveries([
          {
            id: 1,
            patient: "John Doe",
            room: "201",
            meal: "Morning",
            items: ["Oatmeal", "Fresh Fruits"],
            status: "Delivered",
            deliveryTime: "08:30 AM",
            assignedTo: "Mike Wilson"
          },
          
        ]);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      selectedStatus === 'all' ||
      (selectedStatus === 'preparing' && delivery.status === 'Preparing') ||
      (selectedStatus === 'in-transit' && delivery.status === 'In Transit') ||
      (selectedStatus === 'delivered' && delivery.status === 'Delivered');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/manager/dashboard">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Tracking</h1>
          </div>
          <Button onClick={fetchDeliveries} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by patient name or room..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
              >
                All
              </Button>
              <Button 
                variant={selectedStatus === 'preparing' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('preparing')}
              >
                Preparing
              </Button>
              <Button 
                variant={selectedStatus === 'in-transit' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('in-transit')}
              >
                In Transit
              </Button>
              <Button 
                variant={selectedStatus === 'delivered' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('delivered')}
              >
                Delivered
              </Button>
            </div>
          </div>
        </Card>

        {/* Deliveries List */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorSection message={error} onRetry={fetchDeliveries} />
            </div>
          ) : (
            <div className="grid gap-4 p-6">
              {filteredDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No deliveries found matching your criteria
                </div>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <div 
                    key={delivery.id} 
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{delivery.patient}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Room {delivery.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{delivery.meal} Meal</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{delivery.deliveryTime}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Assigned to: {delivery.assignedTo}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-500">Items:</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {delivery.items.map((item, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

