import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Utensils,
  Clock,
  Bell,
  ChefHat,
  Truck,
  ClipboardList,
  Search,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data for demonstration
const patients = [
  { id: 1, name: 'John Doe', room: '201', status: 'Meal Delivered', diet: 'Low Salt' },
  { id: 2, name: 'Jane Smith', room: '305', status: 'In Preparation', diet: 'Diabetic' },
  { id: 3, name: 'Mike Johnson', room: '102', status: 'Pending', diet: 'Regular' },
];

const deliveries = [
  { id: 1, patient: 'John Doe', room: '201', meal: 'Lunch', status: 'Delivered', time: '12:30 PM' },
  { id: 2, patient: 'Jane Smith', room: '305', meal: 'Lunch', status: 'In Transit', time: '12:45 PM' },
];

export default function ManagerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Hospital Food Manager Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link to="/manager/deliveries">
                <Button variant="outline" size="sm">
                  <Truck className="w-4 h-4 mr-2" />
                  Track Deliveries
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                HM
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the component remains the same */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Patients', value: '45' },
            { icon: Utensils, label: 'Meals Prepared', value: '128' },
            { icon: Truck, label: 'Active Deliveries', value: '12' },
            { icon: Clock, label: 'Pending Orders', value: '8' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search patients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
            <Button variant="outline">
              <ClipboardList className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
            </div>
            <div className="divide-y">
              {patients.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/manager/patient/${patient.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">Room {patient.room} • {patient.diet}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      patient.status === 'Meal Delivered' ? 'bg-green-100 text-green-800' :
                      patient.status === 'In Preparation' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Delivery Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Deliveries</h2>
              <Link to="/manager/deliveries">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="divide-y">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{delivery.patient}</p>
                      <p className="text-sm text-gray-500">
                        Room {delivery.room} • {delivery.meal} • {delivery.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}