// app/dashboard/staff/page.tsx or wherever your StaffDashboard is
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaTimes, FaPlus, FaStethoscope } from 'react-icons/fa';

interface Appointment {
  id: string;
  date: string;
  notes?: string;
  patient: { name: string };
  doctor: { user: { name: string } };
}

export default function StaffDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [appointmentsRes, statsRes] = await Promise.all([
          fetch('/api/appointment/fetchAll'),
          fetch('/api/dashboard/stats'),
        ]);

        if (!appointmentsRes.ok || !statsRes.ok) throw new Error('Failed to fetch');

        const { appointments } = await appointmentsRes.json();
        const { doctors, patients, appointments: totalAppointments } = await statsRes.json();

        setAppointments(appointments);
        setStats({ doctors, patients, appointments: totalAppointments });
      } catch (error) {
        console.error('Error fetching staff dashboard:', error);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Toggle for small screens */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded-md text-blue-700 bg-white/90 backdrop-blur-md shadow md:hidden"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-64 w-full h-full md:h-auto`}
      >
        <aside className="h-full bg-white p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-blue-800">Staff Dashboard</h2>
          <nav className="space-y-4 text-blue-700 font-medium">
            <Link href="/stttest/patient" className="block hover:text-blue-600">
              <FaPlus className="inline-block mr-2" />
              Add Patient
            </Link>
            <Link href="/stttest" className="block hover:text-blue-600">
              <FaStethoscope className="inline-block mr-2" />
              Add Appointment
            </Link>
          </nav>
        </aside>
      </div>

      {/* Close Button Outside Sidebar */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white text-blue-700 shadow-lg md:hidden"
        >
          <FaTimes />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 md:ml-64">
        <h1 className="text-2xl font-semibold text-blue-800">Staff Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Doctors" value={stats.doctors} color="bg-green-100 text-green-800" />
          <StatCard label="Patients" value={stats.patients} color="bg-yellow-100 text-yellow-800" />
          <StatCard label="Appointments" value={stats.appointments} color="bg-red-100 text-red-800" />
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Recent Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="p-2">Patient</th>
                  <th className="p-2">Doctor</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appt) => (
                  <tr key={appt.id} className="border-t">
                    <td className="p-2">{appt.patient.name}</td>
                    <td className="p-2">{appt.doctor.user.name}</td>
                    <td className="p-2">{new Date(appt.date).toLocaleString()}</td>
                    <td className="p-2">{appt.notes || '—'}</td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`p-4 rounded-xl shadow ${color}`}>
      <h3 className="text-sm font-medium">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
