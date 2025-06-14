'use client';

import { useEffect, useState } from 'react';

type Doctor = {
  id: string;
  name: string;
  email?: string;
  specialization: string;
};

export default function DoctorTable() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/admin/doctors', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Loading doctors...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Specialization</th>
            <th className="p-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id} className="border-b hover:bg-blue-50 transition">
              <td className="p-3 font-medium text-gray-900">{doc.name}</td>
              <td className="p-3 text-gray-700">{doc.specialization}</td>
              <td className="p-3 text-gray-500">{doc.email || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
