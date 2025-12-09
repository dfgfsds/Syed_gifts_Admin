import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom"
import { getUserOrderApi } from "../../Api-Service/Apis";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function SingleOrder() {
  const { id } = useParams();
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const navigate = useNavigate();
  const { data, isLoading }: any = useQuery({
    queryKey: ['getUserOrder'],
    queryFn: () => getUserOrderApi(`${id}`)
  });

  const onUpdateStatuss = (status: any) => {
    console.log('Update order status:', status);
  };
  return (
    <>
      {isLoading ? (
        <>
          <div className="space-y-4 p-10 animate-pulse">
            <div className="flex gap-2">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>

            <div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="space-y-1 mt-2">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>

            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="space-y-1 mt-2">
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="flex gap-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4 p-10">
          <div className="flex gap-2 cursor-pointer" onClick={() => navigate(-1)}>
            <ArrowLeft />Back
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-700">Customer Details</h4>
            <div className="mt-2 text-sm">
              <p>{data?.data[0]?.consumer_address?.customer_name}</p>
              <p>{data?.data[0]?.consumer_address?.email_address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-700"> Address</h4>
            <div className="mt-2 text-sm">
              <p>{data?.data[0]?.consumer_address?.address_line1},{data?.data[0]?.consumer_address?.address_line1}</p>
              <p>{data?.data[0]?.consumer_address?.city}, {data?.data[0]?.consumer_address?.state} {data?.data[0]?.consumer_address?.zipCode}</p>
              <div className='flex gap-1'>
                <p>{data?.data[0]?.consumer_address?.country}</p>-<p>{data?.data[0]?.consumer_address?.postal_code}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 mb-2">Order History</h4>
            <div className="space-y-2 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 ">
              {data?.data?.map((order: any) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Order #{order?.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order?.created_at)?.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{order?.total_amount}</p>
                      <p className="text-sm text-gray-500">{order?.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={onUpdateStatuss}
        />
      )}
    </>
  )
}