"use client";

import React from "react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  createdAt: string;
}

interface PatientTableProps {
  patients: Patient[];
}

const PatientTable: React.FC<PatientTableProps> = ({ patients }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Patients</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
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
      </div>
    </div>
  );
};

export default PatientTable;
