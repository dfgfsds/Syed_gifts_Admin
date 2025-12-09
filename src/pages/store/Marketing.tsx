import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { DiscountCode } from '../../types';

// Demo data
const demoDiscounts: DiscountCode[] = [
  {
    id: '1',
    storeId: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 1000,
    maxUses: 100,
    usedCount: 45,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    active: true,
  }
];

export default function Marketing() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>(demoDiscounts);
  const [showNewDiscount, setShowNewDiscount] = useState(false);
  const [newDiscount, setNewDiscount] = useState<Partial<DiscountCode>>({
    code: '',
    type: 'percentage',
    value: 0,
    minPurchase: undefined,
    maxUses: undefined,
    active: true,
  });

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const discount: DiscountCode = {
      id: Math.random().toString(36).substr(2, 9),
      storeId: '1',
      code: newDiscount.code!,
      type: newDiscount.type as 'percentage' | 'fixed',
      value: newDiscount.value!,
      minPurchase: newDiscount.minPurchase,
      maxUses: newDiscount.maxUses,
      usedCount: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      active: true,
    };
    setDiscounts([...discounts, discount]);
    setShowNewDiscount(false);
    setNewDiscount({
      code: '',
      type: 'percentage',
      value: 0,
      minPurchase: undefined,
      maxUses: undefined,
      active: true,
    });
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(d => d.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Marketing</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your store's marketing campaigns and promotions
            </p>
          </div>
        </div>

        {/* SEO Section */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">SEO Settings</h3>
            <div className="mt-4 space-y-4">
              <Input
                label="Meta Title"
                placeholder="Your Store Name - Best Products Online"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                  placeholder="Describe your store in 150-160 characters"
                />
              </div>
              <Input
                label="Keywords"
                placeholder="online store, products, shopping (comma separated)"
              />
            </div>
          </div>
        </div>

        {/* Social Media Integration */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Social Media Integration</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Facebook Page URL"
                placeholder="https://facebook.com/your-store"
              />
              <Input
                label="Instagram Profile"
                placeholder="https://instagram.com/your-store"
              />
              <Input
                label="TikTok Profile"
                placeholder="https://tiktok.com/@your-store"
              />
              <Input
                label="Pinterest Profile"
                placeholder="https://pinterest.com/your-store"
              />
            </div>
          </div>
        </div>

        {/* Discount Codes */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Discount Codes</h3>
                <p className="mt-1 text-sm text-gray-500">Create and manage discount codes for your store</p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Button onClick={() => setShowNewDiscount(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Discount
                </Button>
              </div>
            </div>

            {showNewDiscount && (
              <form onSubmit={handleCreateDiscount} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Discount Code"
                    value={newDiscount.code}
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={newDiscount.type}
                      onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as 'percentage' | 'fixed' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <Input
                    label="Value"
                    type="number"
                    value={newDiscount.value}
                    onChange={(e) => setNewDiscount({ ...newDiscount, value: parseFloat(e.target.value) })}
                    required
                  />
                  <Input
                    label="Minimum Purchase (Optional)"
                    type="number"
                    value={newDiscount.minPurchase}
                    onChange={(e) => setNewDiscount({ ...newDiscount, minPurchase: parseFloat(e.target.value) })}
                  />
                  <Input
                    label="Maximum Uses (Optional)"
                    type="number"
                    value={newDiscount.maxUses}
                    onChange={(e) => setNewDiscount({ ...newDiscount, maxUses: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowNewDiscount(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Discount
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uses</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {discounts.map((discount) => (
                    <tr key={discount.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{discount.code}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">{discount.type}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {discount.usedCount}{discount.maxUses ? `/${discount.maxUses}` : ''}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          discount.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {discount.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Affiliate Program */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Affiliate Program</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Commission Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue="percentage"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <Input
                label="Commission Value"
                type="number"
                defaultValue="10"
              />
              <Input
                label="Cookie Duration (days)"
                type="number"
                defaultValue="30"
              />
            </div>
            <div className="mt-4">
              <Button>Save Affiliate Settings</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}