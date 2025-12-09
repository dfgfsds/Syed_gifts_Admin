import React from 'react';
import { OrderStatus } from '../../types/order';

const statusStyles: Record<OrderStatus, { bg: string; text: string }> = {
  Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  Processing: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  Delivered: { bg: 'bg-green-50', text: 'text-green-700' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-700' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const style = statusStyles[status] ?? { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${style.bg} ${style.text}`}
    >
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
}
