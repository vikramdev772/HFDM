import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Clock, CheckCircle, AlertCircle, Utensils, LogOut, Search, User, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import type { MealPreparation, PantryStats } from '@/types/pantry';

export default function PantryDashboard() {
  const navigate = useNavigate();
  const [preparations, setPreparations] = useState<MealPreparation[]>([]);
  const [stats, setStats] = useState<PantryStats>({
    inPreparation: 0,
    readyForDelivery: 0,
    completedToday: 0,
    totalMealsToday: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchPreparations = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // First fetch all patients
      const patientsResponse = await fetch('https://hfdm.onrender.com/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!patientsResponse.ok) {
        throw new Error('Failed to fetch patients');
      }

      const patients = await patientsResponse.json();
      
      // Transform patient data into meal preparations format
      const preparations = patients.map(patient => ({
        id: patient.id,
        patient: patient.name,
        room: patient.roomNumber,
        meal: 'Lunch', // Default to current meal based on time
        items: [], // Will be populated from patient's diet restrictions
        dietaryNotes: patient.allergies.join(', '),
        status: 'In Preparation',
        assignedTo: 'Pending Assignment',
        deliveryTime: '12:00 PM' // Default lunch time
      }));

      setPreparations(preparations);

      // Calculate stats
      const stats = {
        inPreparation: preparations.filter(p => p.status === 'In Preparation').length,
        readyForDelivery: preparations.filter(p => p.status === 'Ready for Delivery').length,
        completedToday: preparations.filter(p => p.status === 'Completed').length,
        totalMealsToday: preparations.length
      };
      setStats(stats);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while fetching data';
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      });

      // Provide mock data during development
      if (process.env.NODE_ENV === 'development') {
        const mockPreparations = [
          {
            id: 1,
            patient: "John Doe",
            room: "201",
            meal: "Lunch",
            items: ["Vegetable Soup", "Whole Grain Bread", "Fresh Fruit"],
            dietaryNotes: "Low sodium, No dairy",
            status: "In Preparation",
            assignedTo: "Chef Mike",
            deliveryTime: "12:30 PM"
          },
          // Add more mock data as needed
        ];
        setPreparations(mockPreparations);
        setStats({
          inPreparation: 1,
          readyForDelivery: 0,
          completedToday: 0,
          totalMealsToday: 1
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: MealPreparation['status']) => {
    setUpdating(id);
    try {
      // For now, just update the local state
      setPreparations(preparations.map(prep => 
        prep.id === id ? { ...prep, status: newStatus } : prep
      ));

      // Update stats
      const updatedPreparations = preparations.map(prep => 
        prep.id === id ? { ...prep, status: newStatus } : prep
      );
      
      setStats({
        inPreparation: updatedPreparations.filter(p => p.status === 'In Preparation').length,
        readyForDelivery: updatedPreparations.filter(p => p.status === 'Ready for Delivery').length,
        completedToday: updatedPreparations.filter(p => p.status === 'Completed').length,
        totalMealsToday: updatedPreparations.length
      });

      toast({
        title: "Success",
        description: `Meal preparation status updated to ${newStatus}`,
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      toast({
        variant: "destructive",
        title: "Error",
        description: message
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchPreparations();
  }, []);

  const getStatusColor = (status: MealPreparation['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Ready for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'In Preparation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPreparations = preparations.filter(prep =>
    prep.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prep.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prep.meal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-4">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading meal preparations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ChefHat className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Pantry Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, Pantry Staff</div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'In Preparation', value: stats.inPreparation, icon: Clock, color: 'text-yellow-600' },
            { label: 'Ready for Delivery', value: stats.readyForDelivery, icon: AlertCircle, color: 'text-blue-600' },
            { label: 'Completed Today', value: stats.completedToday, icon: CheckCircle, color: 'text-green-600' },
            { label: 'Total Meals Today', value: stats.totalMealsToday, icon: Utensils, color: 'text-purple-600' }
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

        {/* Search and Refresh */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search meals or patients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={fetchPreparations} className="sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* Meal Preparations List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Today's Meal Preparations</h2>
          </div>
          <div className="divide-y">
            {filteredPreparations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No meal preparations found
              </div>
            ) : (
              filteredPreparations.map((prep) => (
                <motion.div
                  key={prep.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{prep.patient}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          Room {prep.room} • {prep.meal} • Delivery at {prep.deliveryTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Assigned to: {prep.assignedTo}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(prep.status)}`}>
                          {prep.status}
                        </span>
                      </div>
                      {prep.status !== 'Completed' && (
                        <div className="flex gap-2">
                          {prep.status === 'In Preparation' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(prep.id, 'Ready for Delivery')}
                              disabled={updating === prep.id}
                            >
                              {updating === prep.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                'Mark Ready'
                              )}
                            </Button>
                          )}
                          {prep.status === 'Ready for Delivery' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(prep.id, 'Completed')}
                              disabled={updating === prep.id}
                            >
                              {updating === prep.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                'Complete'
                              )}
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
                          {prep.items.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Dietary Notes:</h4>
                        <p className="text-sm text-gray-600">{prep.dietaryNotes}</p>
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

