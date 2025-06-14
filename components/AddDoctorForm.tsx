'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  specialization: z.string().min(1, 'Specialization is required'),
});

type FormData = z.infer<typeof schema>;

export default function AddDoctorForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/admin/add-doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 border rounded focus:outline-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-2 border rounded focus:outline-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-4 py-2 border rounded focus:outline-blue-500"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Specialization</label>
        <input
          {...register('specialization')}
          className="w-full px-4 py-2 border rounded focus:outline-blue-500"
        />
        {errors.specialization && (
          <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition disabled:opacity-60"
      >
        {isSubmitting ? 'Adding...' : 'Add Doctor'}
      </button>

      {isSubmitSuccessful && <p className="text-green-600 text-sm mt-2">✅ Doctor added successfully</p>}
    </form>
  );
}
