import { useEffect, useState } from 'react';
import Button from '../Button';
import { Product } from '../../types/product';
import { Pagination } from '../../pages/Pagination';
import EmptyBox from '../../assets/image/empty-box.png'
import { deleteAllProductVariantSizeApi, productStatusUpdateApi } from '../../Api-Service/Apis';
import { toast } from 'react-toastify';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  isLoading: any;
}

export default function ProductsTable({ products, onEdit, onView, isLoading }: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<any>();
  const totalPages = Math.ceil(products?.length / itemsPerPage);
  const queryClient = useQueryClient();
  const paginatedItems = products?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const handleDelete = async () => {
    try {
      const updateApi = await deleteAllProductVariantSizeApi(`delete/${deleteId?.id}`, { deleted_by: 'vendor' })
      if (updateApi) {
        queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
        setDeleteModal(false);
        setDeleteId('');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.!");
    } finally {
      setDeleteModal(false);
    }

  }

  const onToggleStatus = async (product: any) => {
    const newStatus = product?.status === true ? false : true;
    console.log(newStatus)
    try {
        const updateApi = await productStatusUpdateApi(`${product?.id}`, {
          status:newStatus,
          updated_by:'vendor'
        });
        if (updateApi) {
          queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
        }
    } catch (error:any) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.!");
    }
  };
  

  return (
    <>
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
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Varieties</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                          {Array.from({ length: 6 }).map((_, idx) => (
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
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Brand</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="px-6 py-3  text-sm font-semibold text-gray-900 text-center">Actions</th>

                          <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {paginatedItems?.map((product: any, index: number) => (
                          <tr key={product.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 flex gap-2">
                              <img src={product?.image_urls[0]} className='w-16 h-16' />
                              {product.name?.length > 20 ? (
                                <div>{product.name.slice(0, 20)}...</div>
                              ) : (
                                <div>{product.name}</div>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{product.brand_name}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">₹{product.price}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{product.stock_quantity}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={product?.status === true}
                                onChange={() => onToggleStatus(product)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-green-500 relative">
                                  <span className={`absolute ${product?.status === true ? "right-1":"left-1"} top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5`}></span>
                                </div>
                              </label>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-2">
                              <Button variant="outline" onClick={() => onView(product)}>View</Button>
                              <Button variant="outline" onClick={() => onEdit(product)}>Edit</Button>
                              <Button variant="outline" onClick={() => { setDeleteId(product), setDeleteModal(true) }}>Delete</Button>
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
              <div className='text-center text-[#1718FE] font-bold'>No Products Found</div>
            </>
          )}

        </>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to Delete <span className='font-bold'>{deleteId?.name}</span>?</p>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  );
}