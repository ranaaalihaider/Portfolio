import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'src/data/chat-settings.json');

export async function POST(req: Request) {
  try {
    let settings = { systemMessage: 'You are a helpful assistant.', apiKey: '' };
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }

    if (!settings.apiKey) {
      return NextResponse.json({ error: 'API key not configured by admin.' }, { status: 500 });
    }

    const { message, history } = await req.json();
    
    // Convert history format if needed, but assuming it's already {role, content}
    const messages = [
      { role: 'system', content: settings.systemMessage },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // A fast, free model on Groq
        messages: messages
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: 'API Error: ' + errorText }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ reply: data.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
