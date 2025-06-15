"use client";
import { useEffect, useState } from "react";

export default function VoiceInput({
  onResult,
}: {
  onResult: (text: string) => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recog.onend = () => setIsListening(false);

    setRecognition(recog);
  }, [onResult]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <button
      type="button"
      onClick={startListening}
      className={`mt-2 px-4 py-2 rounded ${
        isListening ? "bg-gray-400" : "bg-green-600 text-white"
      } hover:opacity-90`}
    >
      🎙️ {isListening ? "Listening..." : "Speak Prescription"}
    </button>
  );
}
