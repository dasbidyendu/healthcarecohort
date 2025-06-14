"use client";

import React, { useEffect, useRef, useState } from "react";

type PatientField = "name" | "age" | "gender" | "phone";

const speechPrompts: Record<PatientField, string> = {
  name: "Please say the patient's full name.",
  age: "Please say the patient's age.",
  gender: "Please say the patient's gender.",
  phone: "Please say the patient's phone number.",
};

const speechSynthesisLanguages: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
};

export default function PatientRegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });
  const [languageCode, setLanguageCode] = useState("en");
  const [recordingField, setRecordingField] = useState<PatientField | null>(
    null
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const speakPrompt = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechSynthesisLanguages[languageCode] || "en-US";
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
        setForm((prev) => ({
          ...prev,
          [field]: field === "age" ? text.replace(/\D/g, "") : text, // digits only for age
        }));
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

    const res = await fetch("/api/staff/register-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("✅ Patient registered!");
      setForm({ name: "", age: "", gender: "", phone: "" });
    } else {
      alert("❌ Failed to register patient.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 mt-10 rounded-lg shadow space-y-5"
    >
      <h2 className="text-2xl font-semibold">📝 Register Patient</h2>

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

      {(["name", "age", "gender", "phone"] as PatientField[]).map((field) => (
        <div key={field}>
          <label className="block text-gray-700 mb-1 capitalize">{field}</label>
          <div className="flex gap-2 items-center">
            <input
              type={field === "age" ? "number" : "text"}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="flex-1 px-4 py-2 border rounded"
              placeholder={`Enter ${field}...`}
              required
            />
            <button
              type="button"
              onClick={() =>
                recordingField === field
                  ? stopRecording()
                  : startRecording(field)
              }
              className={`px-3 py-2 rounded text-white text-sm ${
                recordingField === field ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {recordingField === field ? "⏹ Stop" : "🎙 Record"}
            </button>
          </div>
          {recordingField === field && (
            <p className="text-sm text-red-600 mt-1 animate-pulse">
              Recording {field}...
            </p>
          )}
        </div>
      ))}

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
        ✅ Register Patient
      </button>
    </form>
  );
}
