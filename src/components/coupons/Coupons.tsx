import { Loader, Pencil, Trash2 } from "lucide-react";
import formatDateTime from "../../lib/utils";
import { useState } from "react";
import { deleteCouponApi, GetCouponApi } from "../../Api-Service/authendication";
import { useParams } from "react-router-dom";
import { InvalidateQueryFilters, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button";
import CouponModal from "./CouponModal";

function Coupons({ userId }: any) {
    const [couponModal, setCouponModal] = useState(false);
    const { id } = useParams<{ id: string }>();
    const [editData, setEditData] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteData, setDeleteData] = useState<any>('');
    const queryClient = useQueryClient();

    const getCouponData = useQuery({
        queryKey: ['getCouponData', id],
        queryFn: () => GetCouponApi(`?vendor_id=${id}`)
    })


    const confirmDelete = async () => {
        console.log(deleteData)
        if (deleteData) {
            setLoading(true)
            const response = await deleteCouponApi(deleteData?.id, { deleted_by: `vendor${id}` });
            if (response) {
                queryClient.invalidateQueries(['getCouponData'] as InvalidateQueryFilters);
                setDeleteModal(false);
                setLoading(false)
            }
        }
    };

    return (
        <div className="border-t pt-6">
            <div className='flex justify-between mb-3'>
                <h3 className="text-lg font-medium text-gray-900">Coupon</h3>
                <Button onClick={() => setCouponModal(!couponModal)}>Add Coupon</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCouponData?.data?.data?.data?.map((coupon: any) => (
                    <div
                        key={coupon.id}
                        className="relative bg-white mb-2 w-full max-w-lg rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
                    >

                        <div className="absolute top-3 right-3 flex gap-2">
                            <button
                                className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition"
                                title="Edit Coupon"
                                onClick={() => { setCouponModal(!couponModal), setEditData(coupon) }}
                            >
                                <Pencil className="h-4 w-4 text-yellow-600" />
                            </button>
                            <button
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
                                title="Delete Coupon"
                                onClick={() => { setDeleteModal(!deleteModal), setDeleteData(coupon) }}
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wide uppercase">
                            {coupon?.code || "COUPON CODE"}
                        </h3>

                        <p className="text-sm text-gray-500 mb-4">
                            {coupon?.description
                                ? coupon?.description?.length > 60
                                    ? `${coupon?.description?.slice(0, 60)}...`
                                    : coupon?.description
                                : "No description provided"}
                        </p>


                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span className="font-bold block text-black">Start Date:</span>
                                <span>{formatDateTime(coupon?.start_date)}</span>
                            </div>
                            <div>
                                <span className="font-bold block text-black">Expiry Date:</span>
                                <span>{formatDateTime(coupon?.expiry_date)}</span>
                            </div>
                            <div>
                                <span className="font-bold block text-black">Discount Type:</span>
                                <span className="capitalize">{coupon?.discount_type}</span>
                            </div>

                            {coupon?.discount_type === "percentage" && (
                                <div>
                                    <span className="font-bold block text-black">Percentage:</span>
                                    <span>{coupon?.discount_value}%</span>
                                </div>
                            )}

                            {coupon?.discount_type === "flat" && (
                                <div>
                                    <span className="font-bold block text-black">Flat Discount:</span>
                                    <span>₹{coupon?.flat_discount}</span>
                                </div>
                            )}

                            {coupon?.discount_type === "delivery" && (
                                <div>
                                    <span className="font-bold block text-black">Delivery Discount:</span>
                                    <span>₹{coupon?.delivery_discount}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

            </div>

            {couponModal && (
                <CouponModal close={() => setCouponModal(!couponModal)}
                    editData={editData}
                    userId={userId}
                    setEditData={setEditData}
                />
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold mb-4">Delete Coupon</h2>
                        </div>

                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this {deleteData?.code}?
                        </p>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => { setEditData(""), setLoading(false), setDeleteModal(!deleteModal) }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 gap-2 flex"
                            >
                                Confirm Delete {loading ? (<Loader className='animate-spin' />) : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
export default Coupons; 
