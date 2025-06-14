'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  createdAt: string;
};

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/admin/patients');
        const data = await res.json();

        // ✅ Expecting structure: { patients: [...] }
        if (Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          console.warn('Invalid patient data received');
          setPatients([]);
        }
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto mt-6"
    >
      <h3 className="text-xl font-semibold mb-4 text-blue-800">Patient List</h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-500">No patients found.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Gender</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t hover:bg-blue-50">
                <td className="px-4 py-2">{patient.name}</td>
                <td className="px-4 py-2">{patient.age}</td>
                <td className="px-4 py-2">{patient.gender}</td>
                <td className="px-4 py-2">{patient.phone}</td>
                <td className="px-4 py-2">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}
