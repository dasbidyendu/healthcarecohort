"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddStaffForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [error, setError] = useState("");

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/admin/add-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ❌ DO NOT send Authorization header — session cookie is used automatically
        },
        body: JSON.stringify(data),
        credentials: "include", // ✅ Send cookies (like "session") with request
      });

      if (res.ok) {
        reset();
        onSuccess(); // Close modal or update UI
      } else {
        const { error } = await res.json();
        setError(error || "Failed to add staff");
      }
    } catch (err) {
      console.error("Add staff error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800">Add Staff Member</h2>

      <input
        {...register("name", { required: true })}
        placeholder="Name"
        className="w-full border px-4 py-2 rounded"
      />
      {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

      <input
        {...register("email", { required: true })}
        type="email"
        placeholder="Email"
        className="w-full border px-4 py-2 rounded"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">Email is required</p>
      )}

      <input
        {...register("password", { required: true })}
        type="password"
        placeholder="Password"
        className="w-full border px-4 py-2 rounded"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">Password is required</p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
      >
        Add Staff
      </button>
    </form>
  );
}
