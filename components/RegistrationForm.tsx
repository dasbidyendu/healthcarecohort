"use client";

import React, { useRef, useState } from "react";
import { Loader2, Mic, StopCircle } from "lucide-react";

type FieldKey = "name" | "age" | "gender";

const fieldPrompts: Record<FieldKey, string> = {
  name: "Please say your full name",
  age: "Please say your age",
  gender: "Please say your gender, for example male or female",
};

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
  const [languageCode, setLanguageCode] = useState("en");
  const [transcribing, setTranscribing] = useState(false);

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
      formData.append("language_code", languageCode);

      setTranscribing(true);

      try {
        const res = await fetch("/api/assemblyai", {
          method: "POST",
          body: formData,
        });

        const { text } = await res.json();
        if (text) {
          setForm((prev) => ({
            ...prev,
            [field]: field === "age" ? text.replace(/\D/g, "") : text,
          }));
        }
      } catch (error) {
        console.error("Transcription error:", error);
      }

      setTranscribing(false);
      setRecordingField(null);
    };

    mediaRecorder.start();
    setRecordingField(field);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100 py-16 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-10 space-y-6">
        <h1 className="text-3xl font-bold text-blue-800 text-center">
          🧾 Patient Registration
        </h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Language
          </label>
          <select
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
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
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {field}
            </label>
            <div className="flex items-center gap-3">
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                type={field === "age" ? "number" : "text"}
                placeholder={`Enter ${field}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <button
                type="button"
                onClick={() =>
                  recordingField === field
                    ? stopRecording()
                    : startRecording(field)
                }
                disabled={transcribing}
                className={`p-2 rounded-lg transition ${
                  transcribing
                    ? "bg-gray-300 cursor-not-allowed"
                    : recordingField === field
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {recordingField === field ? (
                  <StopCircle className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}

        {recordingField && (
          <p className="text-sm text-red-600 animate-pulse text-center">
            🎙️ Recording {recordingField}...
          </p>
        )}

        {transcribing && (
          <p className="flex items-center justify-center gap-2 text-sm text-blue-600 text-center animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            Transcribing, please wait...
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-4 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
          disabled={transcribing || !!recordingField}
        >
          ✅ Register
        </button>
      </div>
    </div>
  );
}
