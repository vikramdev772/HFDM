import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Calendar, MapPin, Phone, AlertTriangle, ChevronLeft, Edit, Clock, Utensils, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { EditPatientModal } from './EditPatientModal';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  bed: string;
  floor: string;
  contact: string;
  emergency: string;
  diseases: string[];
  allergies: string[];
}

interface DietChart {
  time: string;
  meals: { name: string; instructions: string }[];
}

interface DeliveryHistory {
  date: string;
  meal: string;
  status: string;
  time: string;
}

interface SectionError {
  message: string;
  retryFn: () => void;
}

const ErrorSection = ({ error, onRetry }: { error: SectionError }) => (
  <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-red-50 rounded-lg">
    <p className="text-red-600 text-center">{error.message}</p>
    <Button variant="outline" size="sm" onClick={() => onRetry()}>
      <RefreshCw className="w-4 h-4 mr-2" />
      Retry
    </Button>
  </div>
);

const LoadingSection = () => (
  <div className="flex items-center justify-center p-6">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [dietCharts, setDietCharts] = useState<DietChart[]>([]);
  const [deliveryHistory, setDeliveryHistory] = useState<DeliveryHistory[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Separate loading states for each section
  const [loadingStates, setLoadingStates] = useState({
    patient: true,
    diet: true,
    delivery: true
  });

  // Separate error states for each section
  const [errors, setErrors] = useState<{
    patient?: SectionError;
    diet?: SectionError;
    delivery?: SectionError;
  }>({});

  const { toast } = useToast();

  const fetchPatientData = async () => {
    setLoadingStates(prev => ({ ...prev, patient: true }));
    setErrors(prev => ({ ...prev, patient: undefined }));
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://hfdm.onrender.com/api/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch patient data');
      const data = await response.json();
      setPatient(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load patient information';
      setErrors(prev => ({
        ...prev,
        patient: { message, retryFn: fetchPatientData }
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, patient: false }));
    }
  };

  const fetchDietChart = async () => {
    setLoadingStates(prev => ({ ...prev, diet: true }));
    setErrors(prev => ({ ...prev, diet: undefined }));

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://hfdm.onrender.com/api/patients/${id}/diet`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch diet chart');
      const data = await response.json();
      setDietCharts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load diet chart';
      setErrors(prev => ({
        ...prev,
        diet: { message, retryFn: fetchDietChart }
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, diet: false }));
    }
  };

  const fetchDeliveryHistory = async () => {
    setLoadingStates(prev => ({ ...prev, delivery: true }));
    setErrors(prev => ({ ...prev, delivery: undefined }));

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://hfdm.onrender.com/api/patients/${id}/deliveries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch delivery history');
      const data = await response.json();
      setDeliveryHistory(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load delivery history';
      setErrors(prev => ({
        ...prev,
        delivery: { message, retryFn: fetchDeliveryHistory }
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, delivery: false }));
    }
  };

  useEffect(() => {
    fetchPatientData();
    fetchDietChart();
    fetchDeliveryHistory();
  }, [id]);

  // If patient data fails to load, show error for entire page
  if (!loadingStates.patient && errors.patient) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorSection error={errors.patient} onRetry={errors.patient.retryFn} />
      </div>
    );
  }

  // Show loading state while patient data is loading
  if (loadingStates.patient || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Patient
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Patient Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Age & Gender</p>
                  <p className="font-medium">{patient.age} • {patient.gender}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Room Details</p>
                  <p className="font-medium">Room {patient.room} • Bed {patient.bed} • Floor {patient.floor}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p className="font-medium">{patient.contact}</p>
                  <p className="text-sm text-gray-500 mt-1">Emergency: {patient.emergency}</p>
                </div>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Medical Conditions</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patient.diseases.map((disease, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                        {disease}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Allergies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patient.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Diet Charts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Diet Chart</h2>
              <Button variant="outline" size="sm">
                <Utensils className="w-4 h-4 mr-2" />
                Update Diet
              </Button>
            </div>
            {loadingStates.diet ? (
              <LoadingSection />
            ) : errors.diet ? (
              <ErrorSection error={errors.diet} onRetry={errors.diet.retryFn} />
            ) : (
              <div className="space-y-6">
                {dietCharts.map((chart, index) => (
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
                {dietCharts.length === 0 && (
                  <p className="text-center text-gray-500">No diet chart available</p>
                )}
              </div>
            )}
          </Card>

          {/* Delivery History */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Today's Delivery Status</h2>
            {loadingStates.delivery ? (
              <LoadingSection />
            ) : errors.delivery ? (
              <ErrorSection error={errors.delivery} onRetry={errors.delivery.retryFn} />
            ) : (
              <div className="space-y-4">
                {deliveryHistory.map((delivery, index) => (
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
                {deliveryHistory.length === 0 && (
                  <p className="text-center text-gray-500">No delivery history available</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {patient && (
        <EditPatientModal
          patient={patient}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onPatientUpdated={fetchPatientData}
        />
      )}
    </div>
  );
}

