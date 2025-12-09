import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../stores/authStore';
// import { useStoreStore } from '../stores/storeStore';
import Button from '../components/Button';
import Input from '../components/Input';
import { useForm } from 'react-hook-form';
import { postVendorUsersCreateApi } from '../Api-Service/Apis';
import SingleImageUpload from '../components/products/SingleImageUpload';


// const subscriptionPlans = [
//   { id: 'monthly', name: 'Monthly', price: 1000, duration: 1, durationUnit: 'month' },
//   { id: 'yearly', name: 'Yearly', price: 10000, duration: 1, durationUnit: 'year' },
//   { id: 'three_year', name: '3 Years', price: 20000, duration: 3, durationUnit: 'year' },
// ] as const;

export default function CreateStore() {
  const navigate = useNavigate();
  // const [selectedPlan, setSelectedPlan] = useState<typeof subscriptionPlans[number] | null>(null);
  // const userId: any = localStorage.getItem('userId');
  const mainVendor: any = localStorage.getItem('mainVendor');
  const [image, setImages] = useState<any>();
  const [logoImage, setLogoImage] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: any) => {
    setErrorMessage('')
    setLoading(true);
    try {
      const payload = {
        name: data?.name,
        contact_number: data?.contact_number,
        email: data?.email,
        location: data?.location,
        password: data?.password,
        rating: data?.rating,
        sales_count: data?.sales_count,
        store_description: data?.store_description,
        store_name: data?.store_name,
        sub_domain_url: data?.sub_domain_url,
        logo: logoImage ? logoImage[0]?.url : '',
        profile_image: image ? image[0]?.url : '',
        theme_id: "theme1",
        // main_multi_vendor_user: 27,
        main_multi_vendor_user:mainVendor,
        created_by: 'main vendor'
      };

      const updateApi = await postVendorUsersCreateApi('', payload);
      if (updateApi) {
        navigate(`/store/${updateApi?.data?.vendor?.id}/products`);
      }
    } catch (error: any) {
      console.error("API request failed:", error?.
        response?.data?.details);
      setErrorMessage(
        error?.response?.data?.details || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!user || !selectedPlan) return;

  //   try {
  //     const startDate = new Date();
  //     const endDate = new Date();
  //     if (selectedPlan.durationUnit === 'month') {
  //       endDate.setMonth(endDate.getMonth() + selectedPlan.duration);
  //     } else {
  //       endDate.setFullYear(endDate.getFullYear() + selectedPlan.duration);
  //     }

  //     createStore({
  //       ownerId: user.id,
  //       name,
  //       subdomain,
  //       description,
  //       active: true,
  //       subscription: {
  //         plan: selectedPlan.id as 'monthly' | 'yearly' | 'three_year',
  //         startDate: startDate.toISOString(),
  //         endDate: endDate.toISOString(),
  //         status: 'active'
  //       }
  //     });
  //     navigate('/dashboard');
  //   } catch (err) {
  //     setError('Failed to create store');
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-10 py-12">
      <div className="w-full  space-y-8 p-8 bg-white rounded-2xl shadow-lg">

    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create a new store</h1>
        <p className="mt-2 text-sm text-gray-700">
          Get started with your online store in minutes
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6"
      >
        <Input label="Store Name" {...register('store_name')} />

        <Input label="Subdomain" placeholder='http://example11.com' {...register('sub_domain_url')} />
        <Input label="Store Description" {...register('store_description')} />


        <Input label="Full Name" {...register('name', { required: true })} />
        <Input type='email' label="Email" {...register('email', { required: true })} />
        <Input label="Password" type="password" {...register('password', { required: true })} />
        <Input type='number' label="Contact Number" {...register('contact_number')} />
        <Input label="Location" {...register('location')} />
        <Input label="Rating" type="number" {...register('rating')} />
        <Input label="Sales Count" type="number" {...register('sales_count')} />
        <div className='flex flex-wrap gap-5 justify-center'>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <SingleImageUpload images={image} onChange={setImages} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo Image</label>
            <SingleImageUpload images={logoImage} onChange={setLogoImage} />
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded">
            {errorMessage}
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>Create Store</Button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
}