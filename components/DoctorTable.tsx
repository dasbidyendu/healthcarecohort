"use client";

type Doctor = {
  id: string;
  specialization: string;
  user: {
    name: string;
    email: string;
  };
};

interface DoctorTableProps {
  doctors: Doctor[];
}

export default function DoctorTable({ doctors }: DoctorTableProps) {
  if (!doctors.length) return <p className="text-center">No doctors found.</p>;

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
              <td className="p-3 font-medium text-gray-900">{doc.user.name}</td>
              <td className="p-3 text-gray-700">{doc.specialization}</td>
              <td className="p-3 text-gray-500">{doc.user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
