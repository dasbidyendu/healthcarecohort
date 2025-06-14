'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaUserShield } from 'react-icons/fa';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['HOSPITAL_ADMIN', 'STAFF', 'DOCTOR'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setErrorMsg('Invalid credentials or role');
    } else {
      setErrorMsg('');
      // Optionally: redirect to dashboard
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-[300px] h-[300px] bg-blue-300 rounded-full mix-blend-multiply opacity-20 blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-indigo-300 rounded-full mix-blend-multiply opacity-20 blur-2xl animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl max-w-md w-full px-8 py-10 relative z-10"
      >
        <div className="text-center mb-8">
          <FaUserShield className="text-blue-700 text-4xl mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-gray-800">Login to DocSyne</h2>
          <p className="text-gray-500 mt-1 text-sm">Secure login for Admins, Staff & Doctors</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="you@hospital.com"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              {...register('role')}
              className="w-full border px-4 py-2 rounded-lg focus:outline-blue-600 bg-white shadow-sm"
              defaultValue=""
            >
              <option value="" disabled>Select your role</option>
              <option value="HOSPITAL_ADMIN">Hospital Admin</option>
              <option value="STAFF">Registration Staff</option>
              <option value="DOCTOR">Doctor</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-700 text-white py-2 rounded-full hover:shadow-lg hover:bg-blue-800 transition duration-300"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {errorMsg && <p className="text-red-600 text-center mt-3">{errorMsg}</p>}
        </form>
      </motion.div>
    </section>
  );
}
