"use client";

import React, { useEffect, useRef, useState } from "react";

type AppointmentField = "notes";

interface Doctor {
  id: string;
  user: { name: string };
}
interface Patient {
  id: string;
  name: string;
}

const speechSynthesisLanguages: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  hi: "hi-IN",
  ar: "ar-SA",
  zh: "zh-CN",
};

const prompts: Record<AppointmentField, string> = {
  notes: "Please speak the appointment notes clearly.",
};

export default function Page() {
  const [form, setForm] = useState({
    doctorId: "",
    patientId: "",
    date: "",
    notes: "",
  });

  const [languageCode, setLanguageCode] = useState("en");
  const [recordingField, setRecordingField] = useState<AppointmentField | null>(
    null
  );
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch doctors and patients on mount
  useEffect(() => {
    const fetchData = async () => {
      const [docRes, patRes] = await Promise.all([
        fetch("/api/staff/doctors"),
        fetch("/api/staff/patients"),
      ]);
      const doctors = await docRes.json();
      const patients = await patRes.json();

      console.log(doctors, patients);
      setDoctors(doctors.doctors);
      setPatients(patients.patients);
    };

    fetchData();
  }, []);

  const speakPrompt = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechSynthesisLanguages[languageCode] || "en-US";
      utterance.onend = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  const startRecording = async (field: AppointmentField) => {
    await speakPrompt(prompts[field]);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob);
      formData.append("language_code", languageCode);

      const res = await fetch("/api/assemblyai", {
        method: "POST",
        body: formData,
      });

      const { text } = await res.json();
      if (text) {
        setForm((prev) => ({ ...prev, [field]: text }));
      }

      setRecordingField(null);
    };

    mediaRecorder.start();
    setRecordingField(field);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/appointment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("✅ Appointment Created!");
      setForm({ doctorId: "", patientId: "", date: "", notes: "" });
    } else {
      alert("❌ Failed to create appointment.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 mt-10 rounded-lg shadow space-y-5"
    >
      <h2 className="text-2xl font-semibold">📅 Create Appointment</h2>

      <div>
        <label className="block mb-1 text-gray-700">Language</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
        >
          {Object.keys(speechSynthesisLanguages).map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Doctor</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          required
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Patient</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          required
        >
          <option value="">-- Select Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Date & Time</label>
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Notes</label>
        <div className="flex gap-2 items-center">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="flex-1 px-4 py-2 border rounded resize-none"
            placeholder="Enter notes..."
          />
          <button
            type="button"
            onClick={() =>
              recordingField === "notes"
                ? stopRecording()
                : startRecording("notes")
            }
            className={`px-3 py-2 rounded text-white text-sm ${
              recordingField === "notes" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {recordingField === "notes" ? "⏹ Stop" : "🎙 Record"}
          </button>
        </div>
        {recordingField === "notes" && (
          <p className="text-sm text-red-600 mt-1 animate-pulse">
            Recording notes...
          </p>
        )}
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
        ✅ Create Appointment
      </button>
    </form>
  );
}
