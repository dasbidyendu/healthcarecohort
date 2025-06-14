'use client';

import { useEffect, useState } from 'react';

type Staff = {
  id: string;
  name: string;
  email: string;
};

export default function StaffTable() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/admin/staff', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStaffList(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Loading staff...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id} className="border-b hover:bg-blue-50 transition">
              <td className="p-3 font-medium text-gray-900">{staff.name}</td>
              <td className="p-3 text-gray-700">{staff.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
