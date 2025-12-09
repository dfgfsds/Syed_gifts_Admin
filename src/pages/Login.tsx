import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import Input from '../components/Input';
import { postLoginInAPi } from '../Api-Service/authendication';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import Logo from '../assets/image/Logo.jpeg'

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState<any>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const updateApi = await postLoginInAPi({ ...data, mainmultivendor_id: 46 });
      if (updateApi?.data) {
        localStorage.setItem('userId', updateApi?.data?.user_id);
        localStorage.setItem('mainVendor', updateApi?.data?.main_multivendor_id);
        navigate('/store/142/products');
        // navigate('/dashboard');
      } else {
        throw new Error(updateApi?.data?.message || 'Unexpected response');
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.error ||
        'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-12">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className='flex justify-center items-center'>
          <img src={Logo} className='w-56 h-40' />
        </div>
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {(errors.email || errors.password) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
              {(errors.email?.message as string) || (errors.password?.message as string)}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />

            <div className="relative">
              <Input
                label="Password"
                type={passwordShow ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                className="absolute right-3 top-[35px] text-gray-400 hover:text-gray-600"
                onClick={() => setPasswordShow((prev) => !prev)}
              >
                {passwordShow ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-300 rounded px-4 py-2">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

