import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const roles = ['manager', 'pantry', 'delivery'] as const;
type Role = typeof roles[number];

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('manager');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate credentials here
    switch (role) {
      case 'manager':
        navigate('/manager/dashboard');
        break;
      case 'pantry':
        navigate('/pantry/dashboard');
        break;
      case 'delivery':
        navigate('/delivery/dashboard');
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="mx-auto h-12 w-12 text-blue-600"
          >
            <Building2 className="w-12 h-12" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Hospital Food Delivery
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="manager">Hospital Manager</option>
                <option value="pantry">Pantry Staff</option>
                <option value="delivery">Delivery Personnel</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </div>
    </motion.div>
  );
}