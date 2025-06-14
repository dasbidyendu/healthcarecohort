"use client";

import { use, useEffect } from "react";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: string; // Assuming role is a string, adjust if needed
};

type StaffTableProps = {
  staffList: Staff[];
};

export default function StaffTable({ staffList }: StaffTableProps) {
  if (!staffList || staffList.length === 0) {
    return <p className="text-center">No staff found.</p>;
  }

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
