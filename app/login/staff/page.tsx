"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Your utility

export default function LoginPage() {
  const [isDoctorView, setIsDoctorView] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-white p-6">
      <div className="relative w-full max-w-4xl h-[500px] rounded-3xl shadow-xl overflow-hidden bg-white flex">
        {/* Left side: Staff Form */}
        <div
          className={cn(
            "w-1/2 p-10 transition-all duration-700 ease-in-out",
            isDoctorView
              ? "-translate-x-full opacity-0"
              : "translate-x-0 opacity-100"
          )}
        >
          <h2 className="text-3xl font-bold mb-6">Staff Login</h2>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-gray-100"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-100"
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
              Login as Staff
            </button>
          </form>
        </div>

        {/* Right side: Doctor Form */}
        <div
          className={cn(
            "w-1/2 p-10 transition-all duration-700 ease-in-out absolute right-0 top-0",
            isDoctorView
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <h2 className="text-3xl font-bold mb-6">Doctor Login</h2>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-gray-100"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-100"
            />
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
              Login as Doctor
            </button>
          </form>
        </div>

        {/* Sliding Blue Card */}
        <div
          className={cn(
            "absolute top-0 h-full w-1/2 bg-blue-500 text-white p-10 flex flex-col justify-center items-center transition-all duration-700 ease-in-out z-20 pointer-events-auto",
            isDoctorView ? "left-0 rounded-r-3xl" : "left-1/2 rounded-l-3xl"
          )}
        >
          <h2 className="text-3xl font-semibold mb-4">
            {isDoctorView ? "Staff Login" : "Doctor Login"}
          </h2>
          <p className="mb-6">
            {isDoctorView
              ? "Switch back to Staff login"
              : "Click below to login as Doctor"}
          </p>
          <button
            onClick={() => setIsDoctorView(!isDoctorView)}
            className="bg-white text-blue-500 px-6 py-2 rounded hover:bg-gray-100 transition"
          >
            {isDoctorView ? "Go to Staff Login" : "Go to Doctor Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
