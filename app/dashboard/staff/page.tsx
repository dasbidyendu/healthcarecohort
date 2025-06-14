"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Appointment {
  id: string;
  date: string;
  notes?: string;
  patient: { name: string };
  doctor: { user: { name: string } };
}

export default function StaffDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  const router = useRouter();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [appointmentsRes, statsRes] = await Promise.all([
          fetch("/api/appointment/fetchAll"),
          fetch("/api/dashboard/stats"),
        ]);

        if (!appointmentsRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch");
        }

        const { appointments } = await appointmentsRes.json();
        const {
          doctors,
          patients,
          appointments: totalAppointments,
        } = await statsRes.json();

        setAppointments(appointments);
        setStats({ doctors, patients, appointments: totalAppointments });
      } catch (error) {
        console.error("Error fetching staff dashboard:", error);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Staff Panel</h2>
        <nav className="space-y-4">
          <Link href="/stttest/patient" className="block hover:underline">
            ➕ Add Patient
          </Link>
          <Link href="/stttest" className="block hover:underline">
            🩺 Add Appointment
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-gray-50">
        <h1 className="text-2xl font-semibold">Staff Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard title="Doctors" count={stats.doctors} />
          <DashboardCard title="Patients" count={stats.patients} />
          <DashboardCard title="Appointments" count={stats.appointments} />
        </div>

        {/* Appointments Table */}
        <div>
          <h2 className="text-xl font-medium mb-4">Recent Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="px-4 py-2">Patient</th>
                  <th className="px-4 py-2">Doctor</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appt) => (
                  <tr key={appt.id} className="border-t text-sm">
                    <td className="px-4 py-2">{appt.patient.name}</td>
                    <td className="px-4 py-2">{appt.doctor.user.name}</td>
                    <td className="px-4 py-2">
                      {new Date(appt.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {appt.notes?.slice(0, 30) || "—"}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-500"
                    >
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

function DashboardCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="p-4 bg-white rounded shadow text-center">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-xl font-bold">{count}</p>
    </div>
  );
}
