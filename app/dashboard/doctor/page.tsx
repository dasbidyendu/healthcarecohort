"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useRouter } from "next/navigation";

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
  appointments: Appointment[];
  prescriptions: Prescription[];
}

interface RawPrescription {
  id: string;
  createdAt: string;
  content: string;
  patient: { name: string };
}

interface PrescriptionContent {
  patient: { name: string; age: string; gender: string };
  diagnosis: string;
  medicines: { name: string; dosage: string; frequency: string }[];
  instructions: string[];
  followUp: string;
}

interface ParsedPrescription extends RawPrescription {
  parsedContent: PrescriptionContent | null;
}

export function formatPrescriptionContent(content: string): string {
  try {
    const data = JSON.parse(content);

    const name = data.patient?.name || "N/A";
    const age = data.patient?.age || "N/A";
    const gender = data.patient?.gender || "N/A";

    const diagnosis = data.diagnosis || "N/A";
    const followUp = data.followUp || "N/A";

    const medicines = (data.medicines || [])
      .map(
        (med: any, index: number) =>
          `  ${index + 1}. ${med.name} — ${med.dosage}, ${med.frequency}`
      )
      .join("\n");

    const instructions = (data.instructions || [])
      .map((instr: string, index: number) => `  ${index + 1}. ${instr}`)
      .join("\n");

    return `
Patient:
  Name: ${name}
  Age: ${age}
  Gender: ${gender}

Diagnosis:
  ${diagnosis}

Medicines:
${medicines || "  None"}

Instructions:
${instructions || "  None"}

Follow-up:
  ${followUp}
    `.trim();
  } catch (err) {
    console.error("Failed to parse prescription content", err);
    return "Invalid prescription format.";
  }
}

export default function DoctorDashboard() {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        router.push("/login");
      }
    };

    checkSession();
  }, []);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<ParsedPrescription[]>([]);

  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        const parsedPrescriptions: ParsedPrescription[] = prescriptions.map(
          (pres: RawPrescription) => {
            let parsedContent: PrescriptionContent | null = null;
            try {
              parsedContent = JSON.parse(pres.content);
            } catch (err) {
              console.warn(`Invalid JSON in prescription ${pres.id}`, err);
            }
            return { ...pres, parsedContent };
          }
        );

        setPrescriptions(parsedPrescriptions);
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
      printWindow.document.write(
        `<pre>${formatPrescriptionContent(selectedPrescription.content)}</pre>`
      );
      printWindow.document.write(`</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Mobile Sidebar Toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white/80 text-blue-700 shadow md:hidden"
        >
          <Menu />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 w-64 h-screen bg-white/30 backdrop-blur-md text-blue-900 shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 p-6 space-y-6`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">DocSyne</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-xl text-red-500"
          >
            <X />
          </button>
        </div>

        <nav className="space-y-4">
          <Link
            href="/dashboard/doctor/create-prescription"
            className="block hover:underline"
          >
            New Prescription
          </Link>
          <button
            onClick={() => setShowDoctorModal(true)}
            className="block hover:underline"
          >
            My Details
          </button>
        </nav>
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8">
        {/* Patients */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            My Patients
          </h2>
          <ul className="list-disc ml-5 text-gray-700">
            {patients.length ? (
              patients.map((p) => <li key={p.id}>{p.name}</li>)
            ) : (
              <p>No patients assigned.</p>
            )}
          </ul>
        </motion.section>

        {/* Appointments */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            Recent Appointments
          </h2>
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-2 text-left">Patient</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length ? (
                  appointments.slice(0, 5).map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="px-4 py-2">{a.patient.name}</td>
                      <td className="px-4 py-2">
                        {new Date(a.date).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{a.notes || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-6">
                      No appointments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Prescriptions */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            My Prescriptions
          </h2>
          <ul className="space-y-3">
            {prescriptions.map((pr) => (
              <li
                key={pr.id}
                onClick={() => setSelectedPrescription(pr)}
                className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50"
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
        </motion.section>

        {/* Prescription Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
              <h3 className="text-xl font-bold mb-2">Prescription</h3>
              <p>
                <strong>Patient:</strong> {selectedPrescription.patient.name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedPrescription.createdAt).toLocaleString()}
              </p>
              <pre className="mt-4 whitespace-pre-wrap bg-blue-50 p-3 rounded">
                {formatPrescriptionContent(selectedPrescription.content)}
              </pre>
              <div className="flex justify-end mt-4 gap-4">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  🖨 Print
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-3">Doctor Details</h3>
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
                <strong>Joined:</strong>{" "}
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
