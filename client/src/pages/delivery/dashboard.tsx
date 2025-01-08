import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Mock data for assigned deliveries
const assignedDeliveries = [
  {
    id: 1,
    patient: "John Doe",
    room: "201",
    floor: "2nd",
    meal: "Lunch",
    items: ["Vegetable Soup", "Whole Grain Bread", "Fresh Fruit"],
    dietaryNotes: "Low sodium, No dairy",
    status: "Pending",
    scheduledTime: "12:30 PM"
  },
  {
    id: 2,
    patient: "Jane Smith",
    room: "305",
    floor: "3rd",
    meal: "Lunch",
    items: ["Grilled Chicken", "Steamed Vegetables", "Rice"],
    dietaryNotes: "Gluten-free",
    status: "In Progress",
    scheduledTime: "12:45 PM"
  },
  {
    id: 3,
    patient: "Robert Brown",
    room: "102",
    floor: "1st",
    meal: "Lunch",
    items: ["Fish Fillet", "Mashed Potatoes", "Green Beans"],
    dietaryNotes: "Diabetic meal",
    status: "Delivered",
    scheduledTime: "12:15 PM"
  }
];

export default function DeliveryDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [deliveries, setDeliveries] = useState(assignedDeliveries);

  const handleStatusUpdate = (id: number, newStatus: string) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    ));
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
    // Logic for logging out (if any) can go here
    navigate('/login'); // Navigate to the login route
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Box className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, Delivery Staff</div>
              <Button variant="outline" size="sm" onClick={handleLogout}> {/* Add onClick for logout */}
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
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

        {/* Deliveries List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Today's Deliveries</h2>
          </div>
          <div className="divide-y">
            {deliveries.map((delivery) => (
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
                        {delivery.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(delivery.id, 'In Progress')}
                          >
                            Start Delivery
                          </Button>
                        )}
                        {delivery.status === 'In Progress' && (
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
