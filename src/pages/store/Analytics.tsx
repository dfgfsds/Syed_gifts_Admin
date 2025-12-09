import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Analytics as AnalyticsData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Demo data
const demoAnalytics: AnalyticsData = {
  revenue: {
    daily: [1200, 1500, 1800, 1400, 2000, 2200, 1900],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  orders: {
    daily: [12, 15, 18, 14, 20, 22, 19],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  topProducts: [
    { name: 'Product A', sales: 45, revenue: 4500 },
    { name: 'Product B', sales: 32, revenue: 3200 },
    { name: 'Product C', sales: 28, revenue: 2800 },
  ],
  customerStats: {
    total: 250,
    new: 45,
    returning: 205,
  },
};

export default function Analytics() {
  const [analytics] = useState<AnalyticsData>(demoAnalytics);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [facebookPixelId, setFacebookPixelId] = useState('');

  const revenueData = {
    labels: analytics.revenue.labels,
    datasets: [
      {
        label: 'Revenue',
        data: analytics.revenue.daily,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const ordersData = {
    labels: analytics.orders.labels,
    datasets: [
      {
        label: 'Orders',
        data: analytics.orders.daily,
        backgroundColor: 'rgb(54, 162, 235)',
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-700">
          Track your store's performance and customer behavior
        </p>

        {/* Analytics Integration */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Analytics Integration</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Analytics ID
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    GA-
                  </span>
                  <input
                    type="text"
                    value={googleAnalyticsId}
                    onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="XXXXXXXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={facebookPixelId}
                  onChange={(e) => setFacebookPixelId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="XXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{analytics.customerStats.total}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">New Customers</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{analytics.customerStats.new}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Returning Customers</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{analytics.customerStats.returning}</dd>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue</h3>
            <Line
              data={revenueData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Orders</h3>
            <Bar
              data={ordersData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Products */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Top Products</h3>
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Product</th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Sales</th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {analytics.topProducts.map((product) => (
                        <tr key={product.name}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{product.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">{product.sales}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">₹{product.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}