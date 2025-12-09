import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import Input from '../components/Input';
import { postCreateMultiVendorAPi } from '../Api-Service/authendication';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const imageUrl = 'https://img.freepik.com/free-vector/smiling-redhaired-boy-illustration_1308-176664.jpg?t=st=1745060795~exp=1745064395~hmac=3ecdface2e5786c2393a544e425e518729d078f7fecc99faa97c74d4fb96a671&w=740'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const onSubmit = async (data: any) => {
  //   const payload = {
  //     ...data,
  //     created_by: 'admin',
  //     profile_image: imageUrl
  //   }
  //   try {
  //     const response = await postCreateMultiVendorAPi(payload);
  //     if (response) {
  //       localStorage.setItem('userId', response?.data?.user?.id);
  //       localStorage.setItem('mainVendor', response?.data?.main_multivendor_user?.id);
  //       localStorage.setItem('role', response?.data?.user?.role)
  //       localStorage.setItem('mobile', response?.data?.user?.contact_number)
  //       localStorage.setItem('userName', response?.data?.user?.name)
  //       navigate('/create-store');
  //     }

  //   } catch (err) {
  //     // setError('Failed to create account');
  //   }
  // };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg('');
    const payload = {
      ...data,
      created_by: 'admin',
      profile_image: imageUrl,
    };

    try {
      const response = await postCreateMultiVendorAPi(payload);

      if (response) {
        localStorage.setItem('userId', response?.data?.user?.id);
        localStorage.setItem('mainVendor', response?.data?.main_multivendor_user?.id);
        localStorage.setItem('role', response?.data?.user?.role);
        localStorage.setItem('mobile', response?.data?.user?.contact_number);
        localStorage.setItem('userName', response?.data?.user?.name);
        // navigate('/create-store');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-12">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Full name"
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
              error={errors.fullName?.message}
            />
            <Input
              label="Email address"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />
            <Input
              label="Contact Number"
              type="number"
              maxLength={10}
              {...register('contact_number', {
                required: 'Contact number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Contact number must be 10 digits',
                },
              })}
              error={errors.contact_number?.message}
            />
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                {...register('profile_image')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div> */}
          </div>
          {errorMsg && (
            <div className="text-center text-red-500 font-medium py-2">
              {errorMsg}
            </div>
          )}

          <Button disabled={loading} type="submit" loading={loading} className="w-full disabled:opacity-50">
            {loading ? (<>Creating... <Loader2 className='animate-spin' /> </>) : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
