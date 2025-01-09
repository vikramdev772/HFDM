import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Utensils, Clock, Bell, Truck, ClipboardList, Search, Plus, Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import type { Patient, Delivery, DashboardStats } from '@/types/dashboard';
import { AddPatientModal } from './add-patient-modal';

const API_URL = 'https://hfdm.onrender.com/api';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    mealsPrepaped: 0,
    activeDeliveries: 0,
    pendingOrders: 0
  });

  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch patients
      const patientsResponse = await fetch(`${API_URL}/patients`, { headers });
      if (!patientsResponse.ok) throw new Error('Failed to fetch patients');
      const patientsData = await patientsResponse.json();
      setPatients(patientsData);

      // Fetch deliveries
      const deliveriesResponse = await fetch(`${API_URL}/deliveries`, { headers });
      if (!deliveriesResponse.ok) throw new Error('Failed to fetch deliveries');
      const deliveriesData = await deliveriesResponse.json();
      setDeliveries(deliveriesData);

      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_URL}/dashboard/stats`, { headers });
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
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
    fetchData();
  }, []);

  const MobileMenu = () => (
    <div className={`
      fixed inset-0 z-50 transform bg-background transition-transform duration-200 ease-in-out
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col space-y-4 p-4">
        <Link to="/manager/deliveries" className="w-full">
          <Button variant="ghost" className="w-full justify-start">
            <Truck className="mr-2 h-4 w-4" />
            Track Deliveries
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start">
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group"
    >
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardContent className="flex items-center p-6">
          <motion.div
            className="rounded-lg bg-primary/10 p-2 transition-all duration-300 group-hover:bg-primary/20"
            whileHover={{ scale: 1.05 }}
          >
            <Icon className="h-6 w-6 text-primary" />
          </motion.div>
          <div className="ml-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <motion.p 
              className="text-2xl font-semibold"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2 }}
            >
              {value}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold md:text-2xl">Hospital Food Manager</h1>
          </div>
          <div className="hidden items-center space-x-4 md:flex">
            <Link to="/manager/deliveries">
              <Button variant="outline" size="sm">
                <Truck className="mr-2 h-4 w-4" />
                Track Deliveries
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Avatar>
              <AvatarFallback>HM</AvatarFallback>
            </Avatar>
          </div>
          <div className="md:hidden">
            <Avatar>
              <AvatarFallback>HM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && <MobileMenu />}

      <main className="container space-y-8 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: 'Total Patients', value: stats.totalPatients },
            { icon: Utensils, label: 'Meals Prepared', value: stats.mealsPrepaped },
            { icon: Truck, label: 'Active Deliveries', value: stats.activeDeliveries },
            { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders },
          ].map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search patients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:space-x-4">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key="patients"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {patients
                    .filter(patient =>
                      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((patient, index) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/manager/patient/${patient.id}`)}
                        className="block cursor-pointer rounded-md px-4 py-4 first:pt-0 last:pb-0 hover:bg-accent/50"
                      >
                        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Room {patient.roomNumber} • Floor {patient.floorNumber} • Bed {patient.bedNumber}
                            </p>
                          </div>
                          <Badge variant="secondary" className={
                            patient.status === 'Meal Delivered' ? 'bg-green-100 text-green-800' :
                            patient.status === 'In Preparation' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {patient.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              key="deliveries"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>Recent Deliveries</CardTitle>
                  <Link to="/manager/deliveries">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="divide-y">
                  {deliveries.map((delivery, index) => (
                    <motion.div
                      key={delivery.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div>
                          <p className="font-medium">{delivery.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {delivery.roomNumber} • {delivery.meal} • {delivery.time}
                          </p>
                        </div>
                        <Badge variant="secondary" className={
                          delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }>
                          {delivery.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <AddPatientModal 
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onPatientAdded={fetchData}
        />
      </main>
      <Toaster />
    </div>
  );
}