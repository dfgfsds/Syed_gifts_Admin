import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Search from '../../components/Search';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import { Order, OrderStatus } from '../../types/order';
import { getVendorOrderApi } from '../../Api-Service/Apis';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from '../Pagination';
import { Download, Loader2 } from 'lucide-react';
import EmptyBox from '../../assets/image/empty-box.png'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Orders() {
  const { id } = useParams<{ id: string }>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


  const handleUpdateStatus = (status: OrderStatus) => {
    console.log('Update order status:', status);
  };

  const { data, isLoading }: any = useQuery({
    queryKey: ['getVendorOrder', id],
    queryFn: () => getVendorOrderApi(`vendor/${id}`)
  });


  const filteredOrders = data?.data
    ?.filter((order: any) =>
      order?.consumer_address?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.consumer_address?.email_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.total?.toString().includes(searchTerm) ||
      order?.items?.some((item: any) =>
        item?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    // Sort by date in descending order (latest first)
    ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const paginatedItems = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const handleDownloadExcel = () => {
    if (!paginatedItems.length) {
      alert('No Orders to download!');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(paginatedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Orders.xlsx');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-2 text-sm text-gray-700">
          View and manage your store's orders
        </p>

        <div className="mt-4 flex justify-between">
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search orders by ID, customer, status, or products..."
          />
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button onClick={handleDownloadExcel} className='flex'>
              <Download className="h-4 w-4 mr-2 my-auto" />
              Excel Download
            </Button>
          </div>
        </div>
        {isLoading ? (
          <>
            {/* <div className="flex justify-center items-center text-blue-700 text-2xl gap-1 py-5">
              <Loader2 size={40} className="animate-spin" /> Loading...
            </div> */}
            <div className="mt-8 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">S.No</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {[...Array(5)]?.map((_, index) => (
                          <tr key={index}>
                            {Array?.from({ length: 6 })?.map((_, idx) => (
                              <td key={idx} className="px-6 py-4">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {paginatedItems?.length ? (
              <div className="mt-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">S.No</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                            {/* <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th> */}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {paginatedItems?.map((order: any, index: number) => (
                            <tr key={order.id}>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{order?.consumer_address?.customer_name}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                {new Date(order?.created_at).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">₹{order?.total_amount}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm">
                                <OrderStatusBadge status={order?.status} />
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                                  {/* <Button variant="outline" onClick={() => navigate(`singleOrder/${order?.user}`)}> */}


                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between mt-3 px-2">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                      <select
                        value={itemsPerPage}
                        onChange={(e: any) => setItemsPerPage(Number(e.target.value))}
                        className="border h-10 rounded px-2 py-1 text-sm !focus:outline-none !focus:ring-2 !focus:ring-blue-500"
                      >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                      </select>

                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <img className='size-60 mx-auto' src={EmptyBox} />
                <div className='text-center text-[#1718FE] font-bold'>No Orders Found</div>
              </>
            )}</>)}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}