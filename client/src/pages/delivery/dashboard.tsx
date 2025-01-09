import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, CheckCircle, Clock, MapPin, User, AlertCircle, LogOut, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface Delivery {
  id: number;
  patient: string;
  room: string;
  floor: string;
  meal: string;
  items: string[];
  dietaryNotes: string;
  status: 'Pending' | 'In Progress' | 'Delivered';
  scheduledTime: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: 1,
    patient: "John Doe",
    room: "101",
    floor: "1st",
    meal: "Lunch",
    items: ["Chicken Soup", "Whole Wheat Bread", "Apple Juice"],
    dietaryNotes: "No dairy",
    status: "Pending",
    scheduledTime: "12:30 PM"
  },
  {
    id: 2,
    patient: "Jane Smith",
    room: "205",
    floor: "2nd",
    meal: "Dinner",
    items: ["Grilled Fish", "Steamed Vegetables", "Orange Juice"],
    dietaryNotes: "Low sodium",
    status: "In Progress",
    scheduledTime: "6:00 PM"
  },
  {
    id: 3,
    patient: "Robert Johnson",
    room: "310",
    floor: "3rd",
    meal: "Breakfast",
    items: ["Oatmeal", "Fresh Fruit", "Green Tea"],
    dietaryNotes: "Gluten-free",
    status: "Delivered",
    scheduledTime: "8:00 AM"
  }
];

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('No authentication token found');
      }

      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Use mock data instead of API call
      setDeliveries(mockDeliveries);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch deliveries';
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
      fetchDeliveries();
    } catch (err) {
      console.error('Invalid token:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleStatusUpdate = async (id: number, newStatus: 'In Progress' | 'Delivered') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('No authentication token found');
      }

      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setDeliveries(deliveries.map(delivery => 
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      ));

      toast({
        title: "Success",
        description: `Delivery status updated to ${newStatus}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update delivery status';
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-4">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Box className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, Delivery Staff</div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[ 
            { label: 'Pending Deliveries', value: deliveries.filter(d => d.status === 'Pending').length, icon: Clock, color: 'text-yellow-600' },
            { label: 'In Progress', value: deliveries.filter(d => d.status === 'In Progress').length, icon: AlertCircle, color: 'text-blue-600' },
            { label: 'Completed Today', value: deliveries.filter(d => d.status === 'Delivered').length, icon: CheckCircle, color: 'text-green-600' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-6">
          <Button variant="outline" onClick={fetchDeliveries} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Deliveries
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Today's Deliveries</h2>
          </div>
          <div className="divide-y">
            {deliveries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No deliveries found
              </div>
            ) : (
              deliveries.map((delivery) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{delivery.patient}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Room {delivery.room} • {delivery.floor} Floor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Scheduled for {delivery.scheduledTime}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </div>
                      {delivery.status !== 'Delivered' && (
                        <div className="flex gap-2">
                          {delivery.status === 'Pending' && 
                           (userRole === 'MANAGER' || userRole === 'PANTRY' || userRole === 'DELIVERY') && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(delivery.id, 'In Progress')}
                            >
                              Start Delivery
                            </Button>
                          )}
                          {delivery.status === 'In Progress' && 
                           userRole === 'DELIVERY' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(delivery.id, 'Delivered')}
                            >
                              Mark as Delivered
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Meal Items:</h4>
                        <ul className="space-y-1">
                          {delivery.items.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Dietary Notes:</h4>
                        <p className="text-sm text-gray-600">{delivery.dietaryNotes}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

