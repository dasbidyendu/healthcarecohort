'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

type AppointmentField = 'notes';

interface Doctor {
  id: string;
  user: { name: string };
}
interface Patient {
  id: string;
  name: string;
}

const speechSynthesisLanguages: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
};

const prompts: Record<AppointmentField, string> = {
  notes: 'Please speak the appointment notes clearly.',
};

export default function AppointmentForm() {
  const [form, setForm] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    notes: '',
  });

  const [languageCode, setLanguageCode] = useState('en');
  const [recordingField, setRecordingField] = useState<AppointmentField | null>(null);
  const [transcribingField, setTranscribingField] = useState<AppointmentField | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, patRes] = await Promise.all([
          fetch('/api/staff/doctors'),
          fetch('/api/staff/patients'),
        ]);
        const doctorsData = await docRes.json();
        const patientsData = await patRes.json();
        setDoctors(doctorsData.doctors || []);
        setPatients(patientsData.patients || []);
      } catch {
        toast.error('Failed to fetch doctors or patients.');
      }
    };

    fetchData();
  }, []);

  const speakPrompt = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechSynthesisLanguages[languageCode] || 'en-US';
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
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', blob);
      formData.append('language_code', languageCode);

      try {
        const res = await fetch('/api/assemblyai', {
          method: 'POST',
          body: formData,
        });
        const { text } = await res.json();
        if (text) {
          setForm((prev) => ({ ...prev, [field]: text }));
          toast.success('Notes transcribed!');
        } else {
          toast.error('Could not transcribe audio.');
        }
      } catch {
        toast.error('Something went wrong with transcription.');
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
      const res = await fetch('/api/appointment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('✅ Appointment Created!');
        setForm({ doctorId: '', patientId: '', date: '', notes: '' });
      } else {
        toast.error('❌ Failed to create appointment.');
      }
    } catch {
      toast.error('❌ Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <Toaster />

      {/* Background animated blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-200 rounded-full blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-indigo-300 rounded-full blur-2xl opacity-20 animate-blob animation-delay-4000" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl bg-white/70 backdrop-blur-md border border-blue-100 rounded-2xl shadow-xl px-10 py-12 space-y-6"
      >
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
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

          <div className="col-span-full">
            <label className="block mb-1 text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="col-span-full space-y-1">
            <label className="block text-gray-700">Notes</label>
            <div className="relative flex items-center">
              <textarea
                required
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border px-3 py-2 rounded pr-12"
                placeholder="Enter notes or use voice input..."
              />
              <button
                type="button"
                onClick={() =>
                  recordingField === 'notes' ? stopRecording() : startRecording('notes')
                }
                className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                disabled={transcribingField !== null}
              >
                {recordingField === 'notes' ? <Square size={16} /> : <Mic size={16} />}
              </button>
            </div>
            {recordingField === 'notes' && (
              <p className="text-sm text-red-500 animate-pulse">Recording notes...</p>
            )}
            {transcribingField === 'notes' && (
              <p className="text-sm text-blue-600 animate-pulse">Transcribing...</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <label className="block text-sm text-gray-600">Language</label>
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="mt-1 px-3 py-2 border rounded w-full"
            >
              {Object.keys(speechSynthesisLanguages).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <Link
              href="/dashboard/staff"
              className="block text-center mt-3 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Go Back
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
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
      </motion.form>
    </div>
  );
}
