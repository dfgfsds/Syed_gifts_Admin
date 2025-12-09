import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Search from '../../components/Search';
import WebsiteUserModal from '../../components/users/WebsiteUserModal';
import { WebsiteUser } from '../../types/user';
import { getUserApi } from '../../Api-Service/Apis';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from '../Pagination';
import { Download, Loader2 } from 'lucide-react';
import EmptyBox from '../../assets/image/empty-box.png'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function WebsiteUsers() {
  const [selectedUser, setSelectedUser] = useState<WebsiteUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  // getUserApi

  const { data, isLoading }: any = useQuery({
    queryKey: ['getVendorOrder', id],
    queryFn: () => getUserApi(`?vendor_id=${id}`)
  });

  const filteredUsers = data?.data
    ?.filter((user: any) =>
      user.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      user?.contact_number?.includes(searchTerm) ||
      user?.status?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
    ?.sort((a: any, b: any) => {
      // Sort so that latest created_at appears first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });


  const totalPages = Math.ceil(filteredUsers?.length / itemsPerPage);
  const paginatedItems = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const handleDownloadExcel = () => {
    if (!paginatedItems.length) {
      alert('No Customers to download!');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(paginatedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Customers.xlsx');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Website Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage your website's registered users
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users by email, mobile number, or status..."
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
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mobile</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Orders</th>
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
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mobile</th>
                            {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th> */}
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Orders</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {paginatedItems?.map((user: any, index: number) => (
                            <tr key={user.id}>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user?.name}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user?.email}</td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{user?.contact_number}</td>
                              {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td> */}
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                {user.total_orders}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                {/* <Button variant="outline" onClick={() => setSelectedUser(user)}> */}
                                <Button disabled={user?.total_orders === 0} variant="outline" onClick={() => navigate(`singleOrder/${user?.id}`)}>
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
                <div className='text-center text-[#1718FE] font-bold'>No Customers Found</div>
              </>
            )}</>)}

      </div>

      {selectedUser && (
        <WebsiteUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}