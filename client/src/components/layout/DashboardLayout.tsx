// src/components/layouts/DashboardLayout.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  role: 'manager' | 'pantry' | 'delivery';
}

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navigationItems = {
    manager: [
      { title: 'Dashboard', path: '/manager/dashboard' },
      { title: 'Patients', path: '/manager/patients' },
      { title: 'Diet Charts', path: '/manager/diet-charts' },
      { title: 'Deliveries', path: '/manager/deliveries' },
    ],
    pantry: [
      { title: 'Dashboard', path: '/pantry/dashboard' },
      { title: 'Preparation Tasks', path: '/pantry/tasks' },
      { title: 'Delivery Management', path: '/pantry/deliveries' },
    ],
    delivery: [
      { title: 'Dashboard', path: '/delivery/dashboard' },
      { title: 'My Deliveries', path: '/delivery/my-deliveries' },
    ],
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-20"
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Hospital Food System</h2>
          <p className="text-sm text-gray-500 capitalize">{role} Portal</p>
        </div>
        
        <nav className="p-4">
          {navigationItems[role].map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ x: 5 }}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-4 py-2 rounded-lg mb-1 hover:bg-gray-100"
            >
              {item.title}
            </motion.button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="mr-4"
                >
                  {isSidebarOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  {role[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}