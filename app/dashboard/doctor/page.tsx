"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Patient {
  id: string;
  name: string;
}
interface Appointment {
  id: string;
  date: string;
  patient: { name: string };
  notes?: string;
}
interface Prescription {
  id: string;
  createdAt: string;
  content: string;
  patient: { name: string };
}
interface Doctor {
  id: string;
  specialization: string;
  hospitalId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "DOCTOR";
    createdAt: string;
  };
  hospital: {
    id: string;
    name: string;
    email: string;
  };
  appointments: {
    id: string;
    date: string;
    notes: string | null;
    patient: {
      id: string;
      name: string;
      age: number;
      gender: string;
    };
  }[];
  prescriptions: {
    id: string;
    content: string;
    createdAt: string;
    patient: {
      id: string;
      name: string;
    };
  }[];
}

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/doctor/patients"),
      fetch("/api/doctor/appointments"),
      fetch("/api/doctor/prescriptions"),
      fetch("/api/doctor/me"),
    ])
      .then(async ([pRes, aRes, prRes, dRes]) => {
        const { patients } = await pRes.json();
        const { appointments } = await aRes.json();
        const { prescriptions } = await prRes.json();
        const doctor = await dRes.json();
        setPatients(patients);
        setAppointments(appointments);
        setPrescriptions(prescriptions);
        setDoctor(doctor);
      })
      .catch(console.error);
  }, []);

  const handlePrint = () => {
    if (!selectedPrescription) return;
    const printWindow = window.open("", "PRINT", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(
        `<html><head><title>Prescription</title></head><body>`
      );
      printWindow.document.write(
        `<h1>Prescription for ${selectedPrescription.patient.name}</h1>`
      );
      printWindow.document.write(
        `<p><strong>Date:</strong> ${new Date(
          selectedPrescription.createdAt
        ).toLocaleString()}</p>`
      );
      printWindow.document.write(`<pre>${selectedPrescription.content}</pre>`);
      printWindow.document.write(`</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Doctor Panel</h2>
        <nav className="space-y-4">
          <Link
            href="/dashboard/doctor/create-prescription"
            className="block hover:underline"
          >
            📝 New Prescription
          </Link>
          <button
            onClick={() => setShowDoctorModal(true)}
            className="mt-4 w-full text-left hover:underline"
          >
            👨‍⚕️ My Details
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 space-y-8 bg-gray-50">
        <section>
          <h2 className="text-xl font-semibold mb-2">My Patients</h2>
          <ul className="list-disc ml-5">
            {patients.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
            {!patients.length && (
              <p className="text-gray-500">No patients assigned.</p>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Recent Appointments</h2>
          <table className="w-full bg-white shadow rounded mb-4">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-t text-sm">
                  <td className="p-2">{a.patient.name}</td>
                  <td className="p-2">{new Date(a.date).toLocaleString()}</td>
                  <td className="p-2">{a.notes || "—"}</td>
                </tr>
              ))}
              {!appointments.length && (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No appointments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">My Prescriptions</h2>
          <ul className="space-y-2">
            {prescriptions.map((pr) => (
              <li
                key={pr.id}
                onClick={() => setSelectedPrescription(pr)}
                className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-100"
              >
                <p>
                  <strong>Patient:</strong> {pr.patient.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(pr.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
            {!prescriptions.length && (
              <p className="text-gray-500">No prescriptions created yet.</p>
            )}
          </ul>
        </section>

        {/* Prescription Detail Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 max-w-lg w-full shadow-lg relative">
              <h3 className="text-xl font-bold mb-2">Prescription Details</h3>
              <p>
                <strong>Patient:</strong> {selectedPrescription.patient.name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedPrescription.createdAt).toLocaleString()}
              </p>
              <p className="mt-4 whitespace-pre-wrap">
                <strong>Content:</strong> <br />
                {selectedPrescription.content}
              </p>
              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Info Modal */}
        {showDoctorModal && doctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 max-w-md w-full shadow-lg relative">
              <h3 className="text-xl font-bold mb-4">Doctor Details</h3>

              <p>
                <strong>Name:</strong> {doctor.user.name}
              </p>
              <p>
                <strong>Email:</strong> {doctor.user.email}
              </p>
              <p>
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
              <p>
                <strong>Hospital:</strong> {doctor.hospital.name}
              </p>
              <p>
                <strong>Role:</strong> {doctor.user.role}
              </p>
              <p>
                <strong>Joined On:</strong>{" "}
                {new Date(doctor.user.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
