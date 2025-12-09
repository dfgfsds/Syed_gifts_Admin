export interface StoreUser {
  id: string;
  email: string;
  mobileNumber: string;
  password?: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteUser {
  id: string;
  email: string;
  mobileNumber: string;
  password?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  orders: Array<{
    id: string;
    date: string;
    total: number;
    status: string;
  }>;
}