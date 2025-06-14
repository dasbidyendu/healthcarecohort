'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddDoctorForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    const res = await fetch('/api/admin/add-doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      reset();
      onSuccess(); // Close modal
    } else {
      const { error } = await res.json();
      setError(error || 'Failed to add doctor');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800">Add Doctor</h2>

      <input
        {...register('name', { required: true })}
        placeholder="Name"
        className="w-full border px-4 py-2 rounded"
      />
      {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

      <input
        {...register('specialization', { required: true })}
        placeholder="Specialization"
        className="w-full border px-4 py-2 rounded"
      />
      {errors.specialization && <p className="text-red-500 text-sm">Specialization is required</p>}

      <input
        {...register('email', { required: true })}
        type="email"
        placeholder="Email"
        className="w-full border px-4 py-2 rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

      <input
        {...register('password', { required: true })}
        type="password"
        placeholder="Password"
        className="w-full border px-4 py-2 rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
      >
        Add Doctor
      </button>
    </form>
  );
}
