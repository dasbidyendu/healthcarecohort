"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define these interfaces based on your API's expected output
// It's good practice to put these in a separate types/medical.ts file
// as discussed in the previous response, but for this example,
// I'll define them here for self-containment.
interface PatientData {
  name: string;
  age: string;
  gender: string;
}

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
}

interface PrescriptionContent {
  patient: PatientData;
  diagnosis: string;
  medicines: Medicine[];
  instructions: string[];
  followUp: string;
}

interface Patient {
  id: string;
  name: string;
}

export default function CreatePrescription() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<string>(""); // Explicitly string
  const [prescription, setPrescription] = useState<PrescriptionContent | null>(
    null
  ); // Use the defined interface
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await fetch("/api/patient/list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const data = await res.json();
        if (res.ok) setPatients(data.patients || []);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    loadPatients();
  }, []);

  const generatePrescription = async () => {
    if (!symptoms.trim()) return;
    setGenerating(true);
    setAnalysis(""); // Clear previous analysis
    setPrescription(null); // Clear previous prescription

    try {
      const res = await fetch("/api/openai/generate-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, patientId: selectedPatientId }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnalysis(data.analysis);
        setPrescription(data.prescription); // This data should now conform to PrescriptionContent
      } else {
        alert(
          `❌ Failed to generate prescription: ${
            data.details || res.statusText
          }`
        );
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error generating prescription");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId || !prescription) {
      alert("Please select a patient and generate a prescription first.");
      return;
    }

    try {
      const res = await fetch("/api/doctor/prescriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        // Ensure content is stringified JSON before sending
        body: JSON.stringify({
          patientId: selectedPatientId,
          content: JSON.stringify(prescription), // 'prescription' is already an object, stringify it for storage
        }),
      });

      if (res.ok) {
        alert("✅ Prescription saved successfully!");
        router.push("/dashboard/doctor/");
      } else {
        const errorData = await res.json();
        alert(
          `❌ Failed to save prescription: ${
            errorData.message || res.statusText
          }`
        );
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Error submitting prescription");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6 pb-20">
      {" "}
      {/* Added pb-20 for bottom padding */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        📝 Create Prescription
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <label
            htmlFor="patient-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Patient:
          </label>
          <select
            id="patient-select"
            className="w-full mt-1 border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm"
            required
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="symptoms-textarea"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Symptoms:
          </label>
          <textarea
            id="symptoms-textarea"
            className="w-full mt-1 border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm"
            rows={3}
            placeholder="e.g. chest pain, hearing loss"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button
            type="button"
            className={`mt-3 px-5 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
              generating || !symptoms.trim()
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={generatePrescription}
            disabled={generating || !symptoms.trim()}
          >
            {generating ? "Generating..." : "Generate Prescription"}
          </button>
        </div>

        {analysis && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md shadow-sm">
            <label className="block text-md font-semibold mb-2">
              AI Medical Analysis:
            </label>
            <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
          </div>
        )}

        {prescription && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md shadow-sm">
            <label className="block text-md font-semibold text-green-800 mb-3">
              Prescription Preview:
            </label>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600">
                Patient Details:
              </h4>
              <p className="text-gray-700 ml-2">
                Name: {prescription.patient.name || "N/A"}, Age:{" "}
                {prescription.patient.age || "N/A"}, Gender:{" "}
                {prescription.patient.gender || "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600">
                Diagnosis:
              </h4>
              <p className="text-gray-700 ml-2 whitespace-pre-wrap">
                {prescription.diagnosis}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600">
                Medicines:
              </h4>
              {prescription.medicines && prescription.medicines.length > 0 ? (
                <ul className="list-disc list-inside ml-2 text-gray-700">
                  {prescription.medicines.map((med, index) => (
                    <li key={index}>
                      <span className="font-medium">{med.name}</span> -{" "}
                      {med.dosage}, {med.frequency}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-2 text-gray-700">No medicines prescribed.</p>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600">
                Instructions:
              </h4>
              {prescription.instructions &&
              prescription.instructions.length > 0 ? (
                <ul className="list-decimal list-inside ml-2 text-gray-700">
                  {prescription.instructions.map((inst, index) => (
                    <li key={index}>{inst}</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-2 text-gray-700">No special instructions.</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600">
                Follow-up:
              </h4>
              <p className="text-gray-700 ml-2 whitespace-pre-wrap">
                {prescription.followUp}
              </p>
            </div>

            {/* Optional: Keep the raw JSON view for debugging or advanced editing */}
            <details className="mt-5 p-3 bg-gray-100 rounded-md border border-gray-200">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                View/Edit Raw JSON (Advanced)
              </summary>
              <textarea
                className="w-full mt-2 border p-2 rounded-md font-mono text-xs"
                rows={10}
                value={JSON.stringify(prescription, null, 2)}
                onChange={(e) => {
                  try {
                    setPrescription(JSON.parse(e.target.value));
                  } catch (err) {
                    console.error("Invalid JSON:", err);
                    // Optionally, show an error message to the user
                  }
                }}
              />
            </details>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-md text-white font-semibold text-lg transition-colors duration-200 ${
            !selectedPatientId || !prescription
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={!selectedPatientId || !prescription}
        >
          💾 Save Prescription
        </button>
      </form>
    </div>
  );
}
