import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  AlertTriangle,
  ChevronLeft,
  Edit,
  Clock,
  Utensils
} from 'lucide-react';
import { Button } from '../../components/ui/button';

// Mock patient data - replace with API call
const patientData = {
  name: "John Doe",
  age: 45,
  gender: "Male",
  room: "201",
  bed: "A",
  floor: "2nd",
  contact: "+1 234-567-8900",
  emergency: "+1 234-567-8901",
  diseases: ["Diabetes", "Hypertension"],
  allergies: ["Peanuts", "Shellfish"],
  dietCharts: [
    {
      time: "Morning",
      meals: [
        { name: "Oatmeal", instructions: "No sugar" },
        { name: "Fresh Fruits", instructions: "Avoid citrus" }
      ]
    },
    {
      time: "Evening",
      meals: [
        { name: "Vegetable Soup", instructions: "Low salt" },
        { name: "Whole Grain Bread", instructions: "Toasted" }
      ]
    },
    {
      time: "Night",
      meals: [
        { name: "Grilled Chicken", instructions: "No spices" },
        { name: "Steamed Vegetables", instructions: "No salt" }
      ]
    }
  ],
  deliveryHistory: [
    { date: "2024-03-10", meal: "Morning", status: "Delivered", time: "8:30 AM" },
    { date: "2024-03-10", meal: "Evening", status: "Delivered", time: "5:30 PM" },
    { date: "2024-03-10", meal: "Night", status: "Pending", time: "-" }
  ]
};

export default function PatientDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/manager/dashboard">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
          </div>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Patient
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Patient Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{patientData.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Age & Gender</p>
                  <p className="font-medium">{patientData.age} • {patientData.gender}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Room Details</p>
                  <p className="font-medium">Room {patientData.room} • Bed {patientData.bed} • Floor {patientData.floor}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p className="font-medium">{patientData.contact}</p>
                  <p className="text-sm text-gray-500 mt-1">Emergency: {patientData.emergency}</p>
                </div>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Medical Conditions</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.diseases.map((disease, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                        {disease}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Allergies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patientData.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diet Charts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Diet Chart</h2>
              <Button variant="outline" size="sm">
                <Utensils className="w-4 h-4 mr-2" />
                Update Diet
              </Button>
            </div>
            <div className="space-y-6">
              {patientData.dietCharts.map((chart, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium text-gray-900 mb-3">{chart.time} Meal</h3>
                  <div className="space-y-3">
                    {chart.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{meal.name}</p>
                        <p className="text-sm text-gray-500">{meal.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Today's Delivery Status</h2>
            <div className="space-y-4">
              {patientData.deliveryHistory.map((delivery, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{delivery.meal} Meal</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {delivery.time}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    delivery.status === 'Delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}