// app/dashboard/doctor/create-prescription/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  name: string;
}

export default function CreatePrescription() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch("/api/patient/list");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Fetched patients:", data.patients);
        setPatients(data.patients || []);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    }

    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/doctor/prescriptions/create", {
      method: "POST",
      body: JSON.stringify({
        patientId: selectedPatientId,
        content,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard/doctor/");
    } else {
      alert("Failed to create prescription");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create Prescription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Patient
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select a patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prescription
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter prescription notes here..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Prescription
        </button>
      </form>
    </div>
  );
}
