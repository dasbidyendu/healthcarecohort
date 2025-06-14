import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('audio') as Blob;

  if (!file) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const audioBlob = new Blob([buffer], { type: 'audio/webm' });

  const whisperForm = new FormData();
  whisperForm.append('file', audioBlob, 'audio.webm');
  whisperForm.append('model', 'whisper-1');
  whisperForm.append('language', 'en'); // Change to 'hi' for Hindi

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: whisperForm as any,
  });

  const data = await response.json();
  console.log('Whisper full response:', data);

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 500 });
  }

  return NextResponse.json({ text: data.text });
}
