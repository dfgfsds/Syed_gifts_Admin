import { useNavigate } from 'react-router-dom';
import { Plus, Package, ShoppingCart, Users, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/Button';
import { getMultiVendorUserApi, getVendorsByMainMultiVendorIdApi } from '../Api-Service/Apis';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const mainVendor: any = localStorage.getItem('mainVendor');
  //  const { data, isLoading }: any = useQuery({
  //   queryKey: ['getMultiVendorUserData'],
  //   queryFn: () => getMultiVendorUserApi('9')
  // });


  const { data, isLoading }: any = useQuery({
    queryKey: ['getVendorsByMainMultiVendorIdData',mainVendor],
    queryFn: () => getVendorsByMainMultiVendorIdApi(`${mainVendor}`)
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Your Stores</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your online stores and view their performance
            </p>
          </div>
          {data?.data?.data?.length > 0 && (
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Button className='flex' onClick={() => navigate('/create-store')}>
                <Plus className="h-4 w-4 mr-2 my-auto" />
                Create Store
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data?.data?.map((store: any) => (
            <div
              key={store.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {store.logo ? (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={store.logo}
                        alt={store.store_name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xl font-medium text-indigo-600">
                          {store.store_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">
                      {store.store_name}
                    </h3>
                    <p className="text-sm text-gray-500">{store.subdomain}.storebuilder.com</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/store/${store.id}/products`)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/store/${store.id}/orders`)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/store/${store.id}/users`)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/store/${store.id}/settings`)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {data?.data?.data?.length === 0 && (
            <div className="col-span-full">
              <div className="text-center">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No stores</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new store.
                </p>
                <div className="mt-6 flex justify-center">
                  <div>
                    <Button className='flex' onClick={() => navigate('/create-store')}>
                      <Plus className="h-4 w-4 mr-2 my-auto" />
                      Create Store
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}