import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader, X } from 'lucide-react';
// import { postAddressCreateApi, updateAddressApi } from '../../api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { postAddressCreateApi, updateAddressApi } from '../Api-Service/Apis';
import { useParams } from 'react-router-dom';

interface AddressFormProps {
  openModal: boolean;
  handleClose: () => void;
  editData: any;
  setEditData: any;
  pickupValue?: any;
}

export function AddressForm({ openModal, handleClose, editData, setEditData, pickupValue }: AddressFormProps) {
  const userName = localStorage.getItem('userName');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm<any>({
    defaultValues: {
      address_line1: editData?.address_line1 || '',
      address_line2: editData?.address_line2 || '',
      address_type: editData?.address_type || '',
      city: editData?.city || '',
      state: editData?.state || '',
      postal_code: editData?.postal_code || '',
      country: editData?.country || '',
      landmark: editData?.landmark || '',
    }
  });

  // Use useEffect to update form values when editData changes
  useEffect(() => {
    if (editData) {
      setValue('address_line1', editData?.address_line1 || '');
      setValue('address_line2', editData?.address_line2 || '');
      setValue('address_type', editData?.address_type || '');
      setValue('city', editData?.city || '');
      setValue('state', editData?.state || '');
      setValue('postal_code', editData?.postal_code || '');
      setValue('country', editData?.country || '');
      setValue('landmark', editData?.landmark || '');
      setValue('is_primary', editData?.is_primary || false);
      setValue('selected_address', editData?.selected_address || false);
    }
  }, [editData, setValue]);

  // Return null if the modal is not open
  if (!openModal) return null;

  // Form submission handler
  const onFormSubmit = async (data: any) => {
    setLoading(true);
    const formattedData = {
      vendor: id,
      company_name: "userName",
      pickup_location: "madurai",
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      address_type: data.address_type,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
      landmark: data.landmark,
      is_primary: data?.is_primary || false,
      selected_address: data?.selected_address || false,
      ...(editData
        ? { updated_by: userName || 'vendor' }
        : { created_by: userName || 'vendor' })

    };
    if (editData) {
      try {
        const response = await updateAddressApi(`${editData?.id}`, formattedData);
        if (response) {
          queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
          handleClose();
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      try {
        const response = await postAddressCreateApi('', formattedData);
        if (response) {
          queryClient.invalidateQueries(['postGoalType'] as InvalidateQueryFilters);
          handleClose();
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Add Your Address</h2>
          <span onClick={() => { handleClose(), setEditData(''), reset() }} className="cursor-pointer">
            <X />
          </span>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <Controller
                control={control}
                name="address_line1"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="address_line1"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
              <Controller
                control={control}
                name="address_line2"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="address_line2"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address_type" className="block text-sm font-medium text-gray-700">Address Type</label>
              <Controller
                control={control}
                name="address_type"
                render={({ field }) => (
                  <input
                    {...field}
                    id="address_type"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <input
                    {...field}
                    id="city"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <input
                    {...field}
                    id="state"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Pin Code</label>
              <Controller
                control={control}
                name="postal_code"
                render={({ field }) => (
                  <input
                    {...field}
                    id="postal_code"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <input
                    {...field}
                    id="country"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
              <Controller
                control={control}
                name="landmark"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="landmark"
                    // required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            {/* Pickup Location */}
            {pickupValue === 'shiprocket' && (


              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="pickup_location"
                    className="text-sm font-medium text-gray-700"
                  >
                    Pickup Location
                  </label>
                  <p className="text-gray-500 text-xs ml-2">
                    (Vendor pickup address nickname from shiproket )
                  </p>
                </div>
                <Controller
                  control={control}
                  name="pickup_location"
                  // rules={{ required: 'Pickup location is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="pickup_location"
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

                    />
                  )}
                />
              </div>
            )}
            {/* <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="selected_address"
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="selected_address"
                    {...field}
                    checked={field.value || false}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                )}
              />
              <label htmlFor="selected_address" className="text-sm text-gray-700">
                Set as Selected Address
              </label>
            </div> */}

          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => { handleClose(), setEditData(''), reset() }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white rounded-md text-sm font-medium bg-[#FF69B4] hover:bg-[#C71585] disabled:opacity-50 flex gap-2"
            >
              Save {loading ? (<Loader className="animate-spin" size={20} />) : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}