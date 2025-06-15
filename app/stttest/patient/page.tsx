"use client";

import { Mic, Square, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
  const [transcribingField, setTranscribingField] =
    useState<PatientField | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
          setForm((prev) => ({
            ...prev,
            [field]: field === "age" ? text.replace(/\D/g, "") : text,
          }));
          toast.success(`${field} transcribed!`);
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
      const res = await fetch("/api/staff/register-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Patient registered!");
        setForm({ name: "", age: "", gender: "", phone: "" });
      } else {
        toast.error("Failed to register patient.");
      }
    } catch {
      toast.error("Server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl px-10 py-12 space-y-6 border border-blue-100"
      >
        <h1 className="text-3xl font-semibold text-blue-900 mb-4">
          Register New Patient
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {(["name", "age", "gender", "phone"] as PatientField[]).map(
            (field) => (
              <div key={field} className="space-y-1">
                <label className="text-gray-700 font-medium capitalize">
                  {field}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={field === "age" ? "number" : "text"}
                    value={(form as any)[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
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
                    className="absolute right-2 p-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition"
                    disabled={transcribingField !== null}
                  >
                    {recordingField === field ? (
                      <Square size={16} />
                    ) : (
                      <Mic size={16} />
                    )}
                  </button>
                </div>
                {recordingField === field && (
                  <p className="text-sm text-red-500 animate-pulse">
                    Recording...
                  </p>
                )}
                {transcribingField === field && (
                  <p className="text-sm text-blue-500 animate-pulse">
                    Transcribing...
                  </p>
                )}
              </div>
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <label className="block text-sm text-gray-600">Language</label>
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="mt-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {Object.keys(speechSynthesisLanguages).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <Link
              href={"/dashboard/staff"}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 my-2
            rounded-lg text-lg font-semibold transition disabled:opacity-60
            disabled:cursor-not-allowed flex items-center gap-2"
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
                Registering...
              </>
            ) : (
              <>Register Patient</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
