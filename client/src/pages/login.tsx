import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const VALID_CREDENTIALS = {
  'hospital_manager@xyz.com': { password: 'Password@2025', role: 'manager' },
  'hospital_pantry@xyz.com': { password: 'Password@2025', role: 'pantry' },
  'hospital_delivery@xyz.com': { password: 'Password@2025', role: 'delivery' }
} as const;

type Role = 'manager' | 'pantry' | 'delivery';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('manager');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const credentials = VALID_CREDENTIALS[email as keyof typeof VALID_CREDENTIALS];
    
    if (!credentials || credentials.password !== password || credentials.role !== role) {
      setError('Invalid credentials or role mismatch');
      setIsLoading(false);
      return;
    }

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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-xl">
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-xl p-2 flex items-center justify-center"
          >
            <Building2 className="w-8 h-8" />
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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Select Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="manager">Hospital Manager</option>
                <option value="pantry">Pantry Staff</option>
                <option value="delivery">Delivery Personnel</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email"
                className="mt-1"
                disabled={isLoading}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2"
              >
                {error}
              </motion.div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}