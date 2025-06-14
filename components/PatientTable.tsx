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
  createdBy: {
    name: string;
  };
};

export default function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const res = await fetch('/api/admin/patients', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setPatients(data.patients || []);
    };

    fetchPatients();
  }, []);

  if (patients.length === 0) {
    return <p className="text-center text-gray-500">No patients found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <motion.table
        className="min-w-full bg-white text-sm text-left text-gray-600 shadow-md rounded-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <thead className="bg-blue-100 text-blue-800 font-semibold text-sm uppercase">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Age</th>
            <th className="px-6 py-3">Gender</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Added By</th>
            <th className="px-6 py-3">Added On</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-blue-50 transition-colors border-b border-gray-100"
            >
              <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
              <td className="px-6 py-4">{p.age}</td>
              <td className="px-6 py-4">{p.gender}</td>
              <td className="px-6 py-4">{p.phone}</td>
              <td className="px-6 py-4">{p.createdBy?.name ?? 'Unknown'}</td>
              <td className="px-6 py-4">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}
