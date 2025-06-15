"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

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

export default function AppointmentForm() {
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
  const [transcribingField, setTranscribingField] =
    useState<AppointmentField | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, patRes] = await Promise.all([
          fetch("/api/staff/doctors"),
          fetch("/api/staff/patients"),
        ]);
        const doctorsData = await docRes.json();
        const patientsData = await patRes.json();
        setDoctors(doctorsData.doctors || []);
        setPatients(patientsData.patients || []);
      } catch {
        toast.error("Failed to fetch doctors or patients.");
      }
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
      setTranscribingField(field);

      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob);
      formData.append("language_code", languageCode);

      try {
        const res = await fetch("/api/assemblyai", {
          method: "POST",
          body: formData,
        });
        const { text } = await res.json();
        if (text) {
          setForm((prev) => ({ ...prev, [field]: text }));
          toast.success("Notes transcribed!");
        } else {
          toast.error("Could not transcribe audio.");
        }
      } catch {
        toast.error("Something went wrong with transcription.");
      } finally {
        setRecordingField(null);
        setTranscribingField(null);
      }
    };

    mediaRecorder.start();
    setRecordingField(field);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/appointment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("✅ Appointment Created!");
        setForm({ doctorId: "", patientId: "", date: "", notes: "" });
      } else {
        toast.error("❌ Failed to create appointment.");
      }
    } catch {
      toast.error("❌ Server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex items-center justify-center px-4">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl px-10 py-12 space-y-6 border border-green-100"
      >
        <h1 className="text-3xl font-semibold text-green-900 mb-4">
          Create New Appointment
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 text-gray-700">Doctor</label>
            <select
              required
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Doctor</option>
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
              required
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Patient</option>
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Date</label>
            <input
              type="datetime-local"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="space-y-1 col-span-full">
            <label className="block mb-1 text-gray-700">Notes</label>
            <div className="relative flex items-center">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border px-3 py-2 rounded pr-12"
                rows={4}
                placeholder="Enter notes or use voice..."
                required
              />
              <button
                type="button"
                onClick={() =>
                  recordingField === "notes"
                    ? stopRecording()
                    : startRecording("notes")
                }
                className="absolute right-2 bottom-2 p-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white transition"
                disabled={transcribingField !== null}
              >
                {recordingField === "notes" ? (
                  <Square size={16} />
                ) : (
                  <Mic size={16} />
                )}
              </button>
            </div>
            {recordingField === "notes" && (
              <p className="text-sm text-red-500 animate-pulse">Recording...</p>
            )}
            {transcribingField === "notes" && (
              <p className="text-sm text-green-500 animate-pulse">
                Transcribing...
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="block text-sm text-gray-600">Language</label>
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="mt-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              {Object.keys(speechSynthesisLanguages).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <Link
              href="/dashboard/staff"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 mt-3
              rounded-lg font-semibold transition block text-center"
            >
              Go Back
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Appointment</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
