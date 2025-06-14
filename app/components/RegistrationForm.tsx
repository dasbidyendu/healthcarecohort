"use client";

import React, { useRef, useState } from "react";

type FieldKey = "name" | "age" | "gender";

const fieldPrompts: Record<FieldKey, string> = {
  name: "Please say your full name",
  age: "Please say your age",
  gender: "Please say your gender, for example male or female",
};

// BCP 47 tags for speech synthesis
const speechSynthesisLanguages: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  hi: "hi-IN",
  ar: "ar-SA",
  zh: "zh-CN",
};

export default function PatientRegistrationForm() {
  const [form, setForm] = useState({ name: "", age: "", gender: "" });
  const [recordingField, setRecordingField] = useState<FieldKey | null>(null);
  const [languageCode, setLanguageCode] = useState("en"); // for AssemblyAI
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

  const startRecording = async (field: FieldKey) => {
    await speakPrompt(fieldPrompts[field]);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob);
      formData.append("language_code", languageCode); // used for AssemblyAI

      const res = await fetch("/api/assemblyai", {
        method: "POST",
        body: formData,
      });

      const { text } = await res.json();
      if (text) {
        setForm((prev) => ({
          ...prev,
          [field]: field === "age" ? text.replace(/\D/g, "") : text, // filter non-numeric for age
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

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-xl shadow-md border space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        🧾 Patient Registration
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700">Language</label>
        <select
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900"
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {(["name", "age", "gender"] as FieldKey[]).map((field) => (
        <div key={field}>
          <label className="block text-gray-700 capitalize">{field}</label>
          <div className="flex gap-2 items-center mt-1">
            <input
              value={form[field]}
              type={field === "age" ? "number" : "text"}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder={`Enter ${field}`}
            />
            <button
              type="button"
              onClick={() =>
                recordingField === field
                  ? stopRecording()
                  : startRecording(field)
              }
              className={`px-3 py-2 text-white text-sm rounded-md transition ${
                recordingField === field
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {recordingField === field ? "⏹ Stop" : "🎙 Record"}
            </button>
          </div>
        </div>
      ))}

      {recordingField && (
        <p className="text-sm text-red-600 animate-pulse text-center">
          Recording {recordingField}...
        </p>
      )}

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
        ✅ Register
      </button>
    </div>
  );
}
