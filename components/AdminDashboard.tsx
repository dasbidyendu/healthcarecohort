'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import PatientTable from '@/components/PatientTable';
import DoctorTable from '@/components/DoctorTable';
import StaffTable from '@/components/StaffTable';
import AddDoctorForm from '@/components/AddDoctorForm';
import AddStaffForm from '@/components/AddStaffForm';
import { AnimatePresence, motion } from 'framer-motion';

type Tab = 'patients' | 'doctors' | 'staff';
type Modal = 'staff' | 'doctor' | null;

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('patients');
  const [modal, setModal] = useState<Modal>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const renderTable = () => {
    switch (tab) {
      case 'patients':
        return <PatientTable />;
      case 'doctors':
        return <DoctorTable />;
      case 'staff':
        return <StaffTable />;
    }
  };

  const handleModalClose = () => {
    setModal(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <DashboardSidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 md:p-10 relative z-10">
        {/* Top Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex gap-4 mb-6 text-blue-800 font-medium"
        >
          {(['patients', 'doctors', 'staff'] as Tab[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full transition ${
                tab === key
                  ? 'bg-blue-700 text-white shadow-lg'
                  : 'hover:bg-blue-100 bg-white shadow-sm'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)} List
            </button>
          ))}
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl min-h-[60vh]"
        >
          {renderTable()}
        </motion.div>

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <button
            onClick={() => setModal(tab === 'doctors' ? 'doctor' : 'staff')}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full shadow-xl transition"
          >
            + Add {tab === 'doctors' ? 'Doctor' : 'Staff'}
          </button>
        </motion.div>

        {/* Modal Logic */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={handleModalClose}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full relative"
              >
                <button
                  onClick={handleModalClose}
                  className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
                >
                  ✕
                </button>

                {modal === 'staff' ? (
                  <AddStaffForm onSuccess={handleModalClose} />
                ) : (
                  <AddDoctorForm onSuccess={handleModalClose} />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
