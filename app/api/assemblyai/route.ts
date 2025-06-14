import { NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File;
    const languageCode = formData.get('language_code') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert audio file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload audio file using SDK
    const uploadRes = await client.files.upload(buffer);

    // Transcribe using SDK with language code
    const transcript = await client.transcripts.transcribe({
      audio: uploadRes,
      language_code: languageCode || 'en',
    });

    return NextResponse.json({ text: transcript.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
