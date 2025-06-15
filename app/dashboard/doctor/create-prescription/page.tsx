'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Patient {
  id: string;
  name: string;
}

export default function CreatePrescription() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch('/api/patient/list');
        const data = await res.json();
        setPatients(data.patients || []);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      }
    }

    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/doctor/prescriptions/create', {
      method: 'POST',
      body: JSON.stringify({ patientId: selectedPatientId, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/dashboard/doctor/');
    } else {
      alert('❌ Failed to create prescription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-indigo-200 rounded-full blur-2xl opacity-30 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/70 backdrop-blur-xl border border-blue-100 rounded-2xl shadow-xl w-full max-w-2xl px-8 py-10 space-y-6"
      >
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">
           Create Prescription
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-500 shadow-sm"
            >
              <option value="">Select a patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prescription Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescription Notes
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-blue-500 shadow-sm"
              placeholder="Write prescription notes here..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2.5 rounded-full hover:bg-blue-800 transition-all font-semibold shadow-md hover:shadow-xl"
          >
            💾 Save Prescription
          </button>
        </form>
      </motion.div>
    </div>
  );
}
