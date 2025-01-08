import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Filter,
  Clock,
  MapPin,
  User,
  Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Mock data - replace with API call
const deliveries = [
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
  {
    id: 2,
    patient: "Jane Smith",
    room: "305",
    meal: "Morning",
    items: ["Wheat Toast", "Scrambled Eggs"],
    status: "In Transit",
    deliveryTime: "08:45 AM",
    assignedTo: "Sarah Johnson"
  },
  {
    id: 3,
    patient: "Robert Brown",
    room: "102",
    meal: "Morning",
    items: ["Pancakes", "Orange Juice"],
    status: "Preparing",
    deliveryTime: "09:00 AM",
    assignedTo: "Tom Davis"
  }
];

export default function DeliveryTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusColor = (status: string) => {
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
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
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
            <div className="flex gap-2">
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
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid gap-4 p-6">
            {deliveries.map((delivery) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}