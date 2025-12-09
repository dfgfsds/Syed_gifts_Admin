import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoreStore } from '../stores/storeStore';
import { useThemeStore } from '../stores/themeStore';
import Button from '../components/Button';
import Input from '../components/Input';
import { CheckCircle, XCircle, AlertCircle, Pencil, Trash2, MapPin, Plus, Loader, Edit } from 'lucide-react';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAddressApi, getAddressApi, getVendorSidePolicesApi, getVendorWithSiteDetailsApi, putVendorsApi, putVendorWithSiteDetailsApi, updateSelectedAddressApi, updateVendorOtherDetailsApi, updateVendorSidePolicesApi } from '../Api-Service/Apis';
import { AddressForm } from '../components/AddressFrom';
import UpadteSiteDetails from '../components/UpdateSiteDetails';
import { GetCouponApi, postCouponApi, updateCouponApi } from '../Api-Service/authendication';
import { toast } from 'react-toastify';
import DeliveryModal from './StoreModals/DeliveryModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { baseUrl } from '../Api-Service/ApiUrls';
import axios from 'axios';
import SocialMedia from '../components/SocialMedia';

const subscriptionPlans = [
  { id: 'monthly', name: 'Monthly', price: 1000, duration: 1, durationUnit: 'month' },
  { id: 'yearly', name: 'Yearly', price: 10000, duration: 1, durationUnit: 'year' },
  { id: 'three_year', name: '3 Years', price: 20000, duration: 3, durationUnit: 'year' },
] as const;

export default function StoreSettings() {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const { stores, updateStore } = useStoreStore();

  const store = stores.find((s) => s.id === id);
  // const [customDomain, setCustomDomain] = useState(store?.customDomain || '');
  // const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | null>(null);
  // const [showRenewModal, setShowRenewModal] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState<typeof subscriptionPlans[number] | null>(null);
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenMoadl] = useState(false);
  const [editData, setEditData] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const [openSite, setOpenSide] = useState(false)
  const [openSiteModal, setOpenSiteModal] = useState<any>(false);
  const [siteEditKey, setSiteEditKey] = useState<any>('');
  const [siteEditValue, setSiteEditValue] = useState<string>('');
  const [textAreaModal, setTextAreaModal] = useState(false);
  const [textAreaKey, setTextAreaKey] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('')
  const [couponModal, setCouponModal] = useState(false);
  const [couponData, setCouponData] = useState<any>({
    code: '',
    vendor: id,
    description: '',
    discount_type: '',
    discount_value: '',
    flat_discount: '',
    delivery_discount: '',
    start_date: '',
    expiry_date: '',
  });
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [deliveryEditData, setDevliveryEditData] = useState()
  const [giftWrapPrice, setGiftWrapPrice] = useState<string | null>(null);
  const [giftWrapId, setGiftWrapId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  // Fetch gift wrap data
  const getGiftWrapData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/gift-wrap/?vendorId=${id}`);
      const giftData = res?.data?.gift_wrap;

      if (giftData) {
        setGiftWrapPrice(giftData.gift_wrap_price);
        setGiftWrapId(giftData.id);
      } else {
        setGiftWrapPrice(null);
        setGiftWrapId(null);
      }
    } catch (error) {
      console.error("Error fetching gift wrap:", error);
    }
  };

  // Handle Add or Update
  const handleSave = async () => {
    try {
      if (giftWrapId) {
        // 🟡 Update existing gift wrap
        await axios.put(`${baseUrl}/gift-wrap/${giftWrapId}/`, {
          vendorId: id,
          gift_wrap_price: newPrice,
          updated_by: "Admin"
        });
      } else {
        // 🟢 Create new gift wrap
        const res = await axios.post(`${baseUrl}/gift-wrap/`, {
          vendorId: id,
          gift_wrap_price: newPrice,
        });
        setGiftWrapId(res?.data?.id);
      }

      setGiftWrapPrice(newPrice);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving gift wrap:", error);
    }
  };

  useEffect(() => {
    getGiftWrapData()
  }, [])


  const handleChangeSite = (key: string, value: string) => {
    setSiteEditKey(key);
    setSiteEditValue(value);
    setOpenSiteModal(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCouponData((prev: any) => ({ ...prev, [name]: value }));
  };


  const getCouponData = useQuery({
    queryKey: ['getCouponData', id],
    queryFn: () => GetCouponApi(`?vendor_id=${id}`)
  })
  useEffect(() => {
    const data = getCouponData?.data?.data?.data[0];
    if (data) {
      setCouponData({
        code: data?.code || '',
        vendor: data?.vendor || id,
        description: data?.description || '',
        discount_type: data?.discount_type || '',
        discount_value: data?.discount_value || '',
        flat_discount: data?.flat_discount || '',
        delivery_discount: data?.delivery_discount || '',
        start_date: data?.start_date?.split('T')[0] || '',
        expiry_date: data?.expiry_date?.split('T')[0] || '',
      });
    }
  }, [getCouponData?.data?.data, id]);

  const handleSubmitCoupon = async () => {
    if (getCouponData?.data?.data?.data[0]?.id) {
      const updateApi: any = await updateCouponApi(`${getCouponData?.data?.data?.data[0]?.id}`, { ...couponData, updated_by: 'vendor' })
      if (updateApi) {
        queryClient.invalidateQueries(['getCouponData'] as InvalidateQueryFilters);
        setCouponModal(false);
      }
    } else {
      try {
        const updateApi: any = postCouponApi('', { ...couponData, created_by: 'vendor' })
        if (updateApi) {
          queryClient.invalidateQueries(['getCouponData'] as InvalidateQueryFilters);
          setCouponModal(false);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Something went wrong. Please try again.!");
      }
    }

  }

  const { data, isLoading }: any = useQuery({
    queryKey: ['getAddressData', id],
    queryFn: () => getAddressApi(`vendor/${id}/`)
  })


  const getVendorWithSiteDetailsData = useQuery({
    queryKey: ['getVendorWithSiteDetailsData', id],
    queryFn: () => getVendorWithSiteDetailsApi(`${id}/`)
  })
  const vendorSiteDetails = getVendorWithSiteDetailsData?.data?.data;
  console.log(vendorSiteDetails)

  const confirmDelete = async () => {
    if (deleteId) {
      setLoading(true)
      const response = await deleteAddressApi(deleteId, { deleted_by: 'user' });
      if (response) {
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
        setDeleteModal(false);
        setLoading(false)
      }
    }
  };

  const selectAdress = async (value: any) => {
    const updateApi = await updateSelectedAddressApi(`${id}/address/${value}/`, { updated_by: "vendor" })
    if (updateApi) {
      queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
    }
  }

  const handleSubmitSiteChange = async () => {
    const payload: any = {
      [siteEditKey]: siteEditValue,
      updated_by: "vendor",
      // payment_gateway: "razorpay"
    };
    // updateVendorOtherDetailsApi
    if (siteEditKey === 'support_email' || siteEditKey === 'support_contact') {
      try {
        const response = await updateVendorOtherDetailsApi(`${vendorSiteDetails?.vendor_other_details?.id}`, { ...payload});
        if (response) {
          setOpenSiteModal(false);
          queryClient.invalidateQueries(["getVendorWithSiteDetailsData"] as InvalidateQueryFilters);
        }
      } catch (error) {
        // console.error("Update failed:", error);
      }
    } else {
      try {
        if (siteEditKey === "store_name" || siteEditKey === "store_description") {
          const response = await putVendorsApi(`${vendorSiteDetails?.vendor?.id}/`, payload);
          if (response) {
            setOpenSiteModal(false);
            queryClient.invalidateQueries(["getVendorWithSiteDetailsData"] as InvalidateQueryFilters);
          }
          return; // 👈 Prevent the next API call
        }

        const response = await putVendorWithSiteDetailsApi(
          `${vendorSiteDetails?.vendor_site_details?.id}/`,
          payload
        );
        if (response) {
          setOpenSiteModal(false);
          queryClient.invalidateQueries(["getVendorWithSiteDetailsData"] as InvalidateQueryFilters);
        }
      } catch (error) {
        // console.error("Update failed:", error);
      }
    }
  };

  // getVendorSidePolicesApi

  const getVendorSidePolicesData: any = useQuery({
    queryKey: ['getVendorSidePolicesData', id],
    queryFn: () => getVendorSidePolicesApi(`${id}`)
  })



  // UPDATE VENDOR SITE POLICES 
  const updateSitePolices = async () => {
    const payload = {
      [textAreaKey]: textAreaValue,
      updated_by: `vendor${id}`
    }
    try {
      const updateApi = await updateVendorSidePolicesApi(`${id}`, payload)
      if (updateApi) {
        setTextAreaModal(false);
        queryClient.invalidateQueries(["getVendorSidePolicesData"] as InvalidateQueryFilters);
      }
    } catch (error) {

    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-semibold text-gray-900">Store Settings</h2>
        <p className="mt-2 text-sm text-gray-700">
          Manage your store's settings and integrations
        </p>
        <div className="mt-8">
          <div className="space-y-4">
            <Input
              label="Store name"
              value={vendorSiteDetails?.vendor?.store_name}
              // onChange={(e:any) => setName(e.target.value)}
              onFocus={(e: any) => handleChangeSite('store_name', e.target.value)}

              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={vendorSiteDetails?.vendor?.store_description}
                // onChange={(e) => setDescription(e.target.value)}
                onFocus={(e: any) => handleChangeSite('store_description', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <Input
              label="Support email"
              type="email"
              value={vendorSiteDetails?.vendor_other_details?.support_email}
              // onChange={(e:any) => setName(e.target.value)}
              onFocus={(e: any) => handleChangeSite('support_email', e.target.value)}

              required
            />
            <Input
              label="Support contact"
              type="number"
              value={vendorSiteDetails?.vendor_other_details?.support_contact}
              // onChange={(e:any) => setName(e.target.value)}
              onFocus={(e: any) => handleChangeSite('support_contact', e.target.value)}

              required
            />
          </div>
          <div className='flex justify-between mb-3'>
            <h3 className="text-lg font-medium text-gray-900 my-auto">Address Details</h3>
            <button
              // onClick={handleAddNew}
              onClick={() => setOpenMoadl(!openModal)}
              className="flex gap-2 mt-5  px-4 py-2 bg-[#FF69B4]  text-white rounded-lg hover:bg-[#C71585]"
            >
              <Plus className="h-5 w-5" />
              Add New Address
            </button>
          </div>
          <div className="space-y-4">
            {data?.data?.length ? (
              <>
                {data?.data?.map((address: any) => (
                  <div
                    key={address.id}
                    className={`flex items-start justify-between p-4 bg-white rounded-lg shadow-sm  ${address?.is_primary === false && 'border-green-600 border-2'}`}
                  // onClick={() => selectAdress(address.id)}
                  >
                    <div className="flex-1">
                      <input
                        type="radio"
                        name="address"
                        value={address?.id}
                        checked={address?.selected_address === true}
                        onChange={() => selectAdress(address?.id)}
                      />
                      <h3 className="font-medium text-gray-900">
                        {address?.address_type}
                      </h3><br />
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {address.address_line1}
                        </h3>
                        {address.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-sm text-gray-500">{address.country}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setOpenMoadl(!openModal), setEditData(address) }}
                        className="p-1 text-gray-400 hover:text-gray-500"
                        title="Edit address"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => { setDeleteModal(!deleteModal), setDeleteId(address?.id) }}
                        className="p-1 text-gray-400 hover:text-red-500"
                        title="Delete address"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
              </div>
            )}

          </div>

          {/* gift wrap */}
          <div className="pt-6 my-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Gift Wrap</h3>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border border-gray-300 rounded px-3 py-1 w-28"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter price"
                />
                <button
                  onClick={handleSave}
                  className="bg-[#a5291b] text-white px-3 py-1 rounded hover:opacity-90"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : giftWrapPrice ? (
              <div className="flex items-center gap-3">
                <p className="text-gray-700">
                  Current Price:{" "}
                  <span className="font-semibold text-gray-900">₹{giftWrapPrice}</span>
                </p>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setNewPrice(giftWrapPrice);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-[#a5291b] font-medium hover:underline"
              >
                <Plus size={18} /> Add Gift Wrap Price
              </button>
            )}
          </div>

          <div className="border-t  pt-6">
            <h3 className="text-lg font-medium text-gray-900">Custom Domain</h3>
            <p className="mt-1 text-sm text-gray-500">
              Connect your own domain to your store
            </p>
            <div className="mt-4">
              <div className="flex space-x-2">
                <div className="flex-grow">
                  <Input
                    label="Domain"
                    value={vendorSiteDetails?.vendor_site_details?.sub_domain_url}
                    disabled
                    readOnly
                    onFocus={(e: any) => handleChangeSite('sub_domain_url', e.target.value)}
                    placeholder="yourdomain.com"
                  />
                </div>
              </div>
              {verificationStatus && (
                <div className={`mt-2 flex items-center ${verificationStatus === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {verificationStatus === 'success' ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">Domain verified successfully</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm">Domain verification failed</span>
                    </>
                  )}
                </div>
              )}
              {verificationStatus === 'success' && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900">DNS Configuration</h4>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">
                      Add the following DNS records to your domain:
                    </p>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-mono">
                        Type: CNAME<br />
                        Host: www<br />
                        {/* Value: {store.subdomain}.storebuilder.com */}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='border-t py-5'>

          </div>
          <div className="border-t pt-6">
            <div className='flex justify-between mb-3'>
              <h3 className="text-lg font-medium text-gray-900">Delivery Partner Details</h3>
              {vendorSiteDetails?.vendor_site_details?.delivery_partner &&
                (
                  <button className=' px-4 py-2 bg-[#FF69B4]  text-white rounded-lg hover:bg-[#C71585]  flex items-center gap-2'
                    onClick={() => { setDeliveryModal(!deliveryModal), setDevliveryEditData(vendorSiteDetails) }}
                  >
                    Delivery Partner Edit
                  </button>
                )}
            </div>
            {vendorSiteDetails?.vendor_site_details?.delivery_partner || vendorSiteDetails?.vendor_site_details?.delivery_partner_client_id || vendorSiteDetails?.vendor_site_details?.own_courier_company_id ?
              (
                <>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Delivery partner client id"
                      type="text"
                      value={vendorSiteDetails?.vendor_site_details?.delivery_partner}
                      disabled
                    />
                    {vendorSiteDetails?.vendor_site_details?.delivery_partner === 'shiprocket' &&
                      (
                        <>
                          <Input
                            label="Delivery partner client id"
                            type="text"
                            value={vendorSiteDetails?.vendor_site_details?.delivery_partner_client_id}
                            disabled
                          />
                          <Input
                            label="Delivery partner api key"
                            type="text"
                            value={vendorSiteDetails?.vendor_site_details?.delivery_partner_api_key}
                            disabled
                          />
                        </>
                      )}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {vendorSiteDetails?.vendor_site_details?.delivery_partner === 'own_delivery' && (
                      <>
                        <Input
                          label="Own courier company id"
                          type="text"
                          value={vendorSiteDetails?.vendor_site_details?.own_courier_company_id}
                          disabled

                        />
                        <Input
                          label="Own cod delivery charge"
                          type="text"
                          value={vendorSiteDetails?.vendor_site_details?.own_cod_delivery_charge}
                          disabled

                        />
                        <Input
                          label="Own delivery charge"
                          type="text"
                          value={vendorSiteDetails?.vendor_site_details?.own_delivery_charge}
                          disabled

                        />
                      </>
                    )}
                  </div>
                  {vendorSiteDetails?.vendor_site_details?.delivery_partner === 'dtdc' && (
                    <>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <Input
                          label="Delivery Partner Api Key"
                          type="text"
                          value={vendorSiteDetails?.delivery_partner_dtdc_details?.delivery_partner_api_key}
                          disabled
                        />
                        <Input
                          label="Delivery Partner Token"
                          type="text"
                          value={vendorSiteDetails?.delivery_partner_dtdc_details?.delivery_partner_token}
                          disabled
                        />
                      </div>


                      {vendorSiteDetails?.dtdc_pricing_data?.map((item: any, index: number) => (
                        <>
                          <div className='mt-5 text-lg font-bold'>
                            pricing {index + 1}
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2" key={item?.id}>

                            <Input
                              label="Service Type"
                              type="text"
                              disabled
                              value={item?.service_type}

                            />
                            <Input
                              label="Destination"
                              type="text"
                              disabled
                              value={item?.destination}
                            />
                            <Input
                              label="Charge For Initial 500gms"
                              type="text"
                              disabled
                              value={item?.charge_for_initial_500gms}
                            />
                            <Input
                              label="Charge For Additional 500gms"
                              type="text"
                              disabled
                              value={item?.charge_for_additional_500gms}
                            />
                            <Input
                              label="Cod Charges"
                              type="text"
                              disabled
                              value={item?.cod_charges}
                            />
                            <Input
                              label="Cod Percent"
                              type="text"
                              disabled
                              value={`${item?.cod_percent}%`}
                            />
                            <Input
                              label="Declared Value Of Fixed Cod Charge"
                              type="text"
                              disabled
                              value={item?.declared_value_of_fixed_cod_charge}
                            />
                            <Input
                              label="Declared Value Of Cod Charge Percentage In Range"
                              type="text"
                              disabled
                              value={item?.declared_value_of_cod_charge_percentage_in_range}
                            />
                          </div>
                        </>
                      ))}



                    </>
                  )}

                </>
              ) : (
                <div className='flex justify-center '>
                  <button className=' gap-2 bg-[#A12B1A] text-white px-4 py-2 rounded-lg hover:bg-[#D83F29]'
                    onClick={() => setDeliveryModal(!deliveryModal)}
                  >
                    Add Delivery Partner
                  </button>
                </div>
              )
            }


          </div>

          <div className='border-t mt-5 py-5'>

          </div>

          <div className=" pt-6">
            <h3 className="text-lg font-medium text-gray-900">Payment Gateway</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="payment_gateway"
                type="text"
                value={vendorSiteDetails?.vendor_site_details?.payment_gateway}
                onFocus={(e: any) => handleChangeSite('payment_gateway', e.target.value)}
              // readOnly
              // disabled
              />
              <Input
                label="Payment gateway client id"
                type="text"
                value={vendorSiteDetails?.vendor_site_details?.payment_gateway_client_id}
                onFocus={(e: any) => handleChangeSite('payment_gateway_client_id', e.target.value)}
              />

              <Input
                label="Payment gateway api key"
                type="text"
                value={vendorSiteDetails?.vendor_site_details?.payment_gateway_api_key}
                onFocus={(e: any) => handleChangeSite('payment_gateway_api_key', e.target.value)}
              />

            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Store Policies</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Privacy Policy
                </label>
                <textarea
                  rows={6}
                  onFocus={(e) => {
                    setTextAreaModal(true);
                    setTextAreaValue(e.target.value);
                    setTextAreaKey('privacy_policy');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={getVendorSidePolicesData?.data?.data?.privacy_policy}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Terms and Conditions
                </label>
                <textarea
                  rows={6}
                  onFocus={(e) => {
                    setTextAreaModal(true);
                    setTextAreaValue(e.target.value);
                    setTextAreaKey('terms_and_conditions');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={getVendorSidePolicesData?.data?.data?.terms_and_conditions}

                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Policy
                </label>
                <textarea
                  rows={6}
                  onFocus={(e) => {
                    setTextAreaModal(true);
                    setTextAreaValue(e.target.value);
                    setTextAreaKey('delivery_policy');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={getVendorSidePolicesData?.data?.data?.delivery_policy}

                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Refund and Cancellation Policy
                </label>
                <textarea
                  rows={6}
                  onFocus={(e) => {
                    setTextAreaModal(true);
                    setTextAreaValue(e.target.value);
                    setTextAreaKey('refund_and_cancellation_policy');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={getVendorSidePolicesData?.data?.data?.refund_and_cancellation_policy}

                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shipping Policy
                </label>
                <textarea
                  rows={6}
                  onFocus={(e) => {
                    setTextAreaModal(true);
                    setTextAreaValue(e.target.value);
                    setTextAreaKey('shipping_policy');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={getVendorSidePolicesData?.data?.data?.shipping_policy}

                />
              </div>
            </div>
          </div>
        </div>


      </div>
      <SocialMedia />

      {openSiteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Edit {siteEditKey}
                </h3>

                <input
                  className="w-full border px-3 py-2 rounded"
                  value={siteEditValue}
                  onChange={(e) => setSiteEditValue(e.target.value)}
                />

                <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                  <button
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                    onClick={() => setOpenSiteModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="bg-[#FF69B4] hover:bg-[#C71585] text-white px-4 py-2 rounded"
                    onClick={handleSubmitSiteChange}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {textAreaModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg mx-auto rounded-lg p-6 shadow-lg  max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <span className='ml-1'> Edit </span>
              {textAreaKey
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>

            {/* <textarea
              rows={8}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
            /> */}
            <ReactQuill value={textAreaValue} onChange={(value) => setTextAreaValue(value)} />
            <div className="mt-5 flex justify-end space-x-2">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setTextAreaModal(false)}
              >
                Cancel
              </button>

              <button
                className="bg-[#FF69B4] text-white px-4 py-2 rounded hover:bg-[#C71585]"
                onClick={updateSitePolices}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


      <AddressForm
        openModal={openModal}
        handleClose={() => { setOpenMoadl(!openModal), setEditData("") }}
        editData={editData}
        setEditData={setEditData}
        pickupValue={vendorSiteDetails?.vendor_site_details?.delivery_partner}
      />
      <UpadteSiteDetails
        openModal={openSite}
        handleClose={() => setOpenSide(!openSite)}
      />


      {deleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Delete Address</h2>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete this address?
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
      {deliveryModal && (
        <DeliveryModal deliveryEditData={deliveryEditData} handleClose={() => setDeliveryModal(!deliveryModal)} vendorSiteDetails={vendorSiteDetails} />
      )}
    </div>
  );
}