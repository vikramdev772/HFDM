// src/components/ui/StatusBadge.tsx
interface StatusBadgeProps {
    status: 'pending' | 'in-preparation' | 'in-transit' | 'delivered' | 'completed';
    className?: string;
  }
  
  export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const statusStyles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-preparation': 'bg-blue-100 text-blue-800',
      'in-transit': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
    };
  
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]} ${className}`}>
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  }