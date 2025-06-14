'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import AddDoctorForm from './AddDoctorForm';
import AddStaffForm from './AddStaffForm';
import PatientTable from './PatientTable';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [view, setView] = useState<'staff' | 'doctor' | 'patients'>('staff');

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
      {/* Background Elements */}
      <div className="absolute -top-20 left-0 w-[400px] h-[400px] bg-blue-200 opacity-20 blur-3xl rounded-full z-0 animate-pulse" />
      <div className="absolute -bottom-20 right-0 w-[300px] h-[300px] bg-indigo-200 opacity-20 blur-2xl rounded-full z-0 animate-pulse" />

      {/* Sidebar */}
      <Sidebar onSelect={setView} />

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 backdrop-blur-lg shadow-xl rounded-xl p-6"
        >
          {view === 'staff' && (
            <>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Add Staff</h2>
              <AddStaffForm />
            </>
          )}

          {view === 'doctor' && (
            <>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Add Doctor</h2>
              <AddDoctorForm />
            </>
          )}

          {view === 'patients' && (
            <>
              <h2 className="text-2xl font-bold text-blue-800 mb-6">All Patients</h2>
              <PatientTable />
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
