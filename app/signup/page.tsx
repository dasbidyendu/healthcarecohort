'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHospitalSymbol } from 'react-icons/fa';

const schema = z
  .object({
    name: z.string().min(1, 'Hospital name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/hospitals/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem('token', token);
      setSuccess(true);
      reset();
      router.push('/dashboard'); // 👈 Redirect to Admin Dashboard
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-24 overflow-hidden">
      {/* Waves and Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-200 rounded-full opacity-30 blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-200 rounded-full opacity-30 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl max-w-xl w-full px-8 py-10"
      >
        <div className="text-center mb-8">
          <FaHospitalSymbol className="text-blue-700 text-4xl mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Register Your Hospital</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Create a secure hospital admin account to manage your team and patients
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
            <input
              {...register('name')}
              placeholder="Apollo Medical Center"
              className="w-full border px-4 py-2 rounded-lg focus:outline-blue-600 shadow-sm"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="admin@hospital.com"
              className="w-full border px-4 py-2 rounded-lg focus:outline-blue-600 shadow-sm"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full border px-4 py-2 rounded-lg focus:outline-blue-600 shadow-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full border px-4 py-2 rounded-lg focus:outline-blue-600 shadow-sm"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-700 text-white py-2 rounded-full hover:shadow-lg hover:bg-blue-800 transition duration-300"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-center mt-3 font-medium"
            >
              ✅ Hospital registered successfully!
            </motion.p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
