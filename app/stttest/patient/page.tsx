'use client';

import React, { useRef, useState } from 'react';
import { Mic, StopCircle, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type PatientField = 'name' | 'age' | 'gender' | 'phone';

const speechPrompts: Record<PatientField, string> = {
  name: "Please say the patient's full name.",
  age: "Please say the patient's age.",
  gender: "Please say the patient's gender.",
  phone: "Please say the patient's phone number.",
};

const speechSynthesisLanguages: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
};

export default function PatientRegistrationForm() {
  const [form, setForm] = useState({ name: '', age: '', gender: '', phone: '' });
  const [languageCode, setLanguageCode] = useState('en');
  const [recordingField, setRecordingField] = useState<PatientField | null>(null);
  const [loadingField, setLoadingField] = useState<PatientField | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const speakPrompt = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechSynthesisLanguages[languageCode] || 'en-US';
      utterance.onend = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  const startRecording = async (field: PatientField) => {
    await speakPrompt(speechPrompts[field]);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setLoadingField(field);
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
          setForm((prev) => ({
            ...prev,
            [field]: field === 'age' ? text.replace(/\D/g, '') : text,
          }));
        }
      } catch (err) {
        console.error('Voice processing failed:', err);
      } finally {
        setLoadingField(null);
        setRecordingField(null);
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
    const res = await fetch('/api/staff/register-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('✅ Patient registered!');
      setForm({ name: '', age: '', gender: '', phone: '' });
    } else {
      alert('❌ Failed to register patient.');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 px-4">
      {/* Background Blobs */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-blue-200 rounded-full mix-blend-multiply opacity-20 blur-3xl animate-blob" />
      <div className="absolute -bottom-20 -right-20 w-[250px] h-[250px] bg-indigo-200 rounded-full mix-blend-multiply opacity-20 blur-2xl animate-blob animation-delay-4000" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl bg-white rounded-xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-blue-700 text-center">Register Patient</h2>

        {/* Language Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            className="w-full border px-4 py-2 rounded focus:outline-blue-500"
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

        {/* Fields */}
        {(['name', 'age', 'gender', 'phone'] as PatientField[]).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
            <div className="flex items-center gap-2">
              <input
                type={field === 'age' ? 'number' : 'text'}
                value={(form as any)[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="flex-1 px-4 py-2 border rounded focus:outline-blue-500"
                placeholder={`Enter ${field}...`}
                required
              />
              <button
                type="button"
                onClick={() =>
                  recordingField === field ? stopRecording() : startRecording(field)
                }
                disabled={loadingField === field}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition ${
                  recordingField === field ? 'bg-red-600 animate-pulse' : 'bg-green-600'
                }`}
              >
                {loadingField === field ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : recordingField === field ? (
                  <StopCircle size={18} />
                ) : (
                  <Mic size={18} />
                )}
              </button>
            </div>
            {recordingField === field && !loadingField && (
              <p className="text-sm text-red-600 mt-1 animate-pulse">
                Recording {field}...
              </p>
            )}
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-full transition"
        >
          ✅ Register Patient
        </button>
      </motion.form>
    </section>
  );
}
