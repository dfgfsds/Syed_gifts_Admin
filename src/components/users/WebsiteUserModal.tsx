import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';
import { WebsiteUser } from '../../types/user';
import OrderDetailsModal from '../orders/OrderDetailsModal';
import { Order } from '../../types/order';
import { getUserOrderApi } from '../../Api-Service/Apis';
import { useQuery } from '@tanstack/react-query';

interface WebsiteUserModalProps {
  user: WebsiteUser;
  onClose: () => void;
}

export default function WebsiteUserModal({ user, onClose }: WebsiteUserModalProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleUpdateOrderStatus = (status: Order['status']) => {
    // Update order status logic here
    console.log('Update order status:', status);
    setSelectedOrder(null);
  };

  // Demo order data for display
  const getFullOrderDetails = (orderId: string): Order => ({
    id: orderId,
    storeId: '1',
    customerId: user.id,
    customerName: user.email.split('@')[0],
    customerEmail: user.email,
    status: 'processing',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Demo Product',
        color: 'Red',
        size: 'M',
        quantity: 2,
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
      }
    ],
    total: 199.98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
  });

  // getUserOrderApi


  const { data, isLoading }: any = useQuery({
    queryKey: ['getUserOrder'],
    queryFn: () => getUserOrderApi(`${user?.id}`)
  });

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* <div className="space-y-4">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              User Details
            </h3>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">Email: {user.email}</p>
              <p className="text-sm text-gray-500">Mobile: {user.mobileNumber}</p>
              <p className="text-sm text-gray-500">Status: {user.status}</p>
            </div>

            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Order History</h4>
              <div className="space-y-2">
                {user.orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedOrder(getFullOrderDetails(order.id))}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${order.total}</p>
                        <p className="text-sm text-gray-500">{order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div> */}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
}