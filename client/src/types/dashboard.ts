export interface Patient {
    id: number;
    name: string;
    roomNumber: string;
    bedNumber: string;
    floorNumber: string;
    age: number;
    gender: string;
    diseases: string[];
    allergies: string[];
    contactInfo: string;
    emergencyContact: string;
    status: 'Meal Delivered' | 'In Preparation' | 'Pending';
  }
  
  export interface Delivery {
    id: number;
    patientId: number;
    patientName: string;
    roomNumber: string;
    meal: string;
    status: 'Delivered' | 'In Transit';
    time: string;
  }
  
  export interface DashboardStats {
    totalPatients: number;
    mealsPrepaped: number;
    activeDeliveries: number;
    pendingOrders: number;
  }
  
  