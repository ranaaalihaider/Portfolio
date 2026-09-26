import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_MESSAGE = `Tum Aimen Shahzad ke liye ek caring, affectionate aur helpful AI chat ho. Aimen se hamesha pyaar, narmi aur izzat se baat karo. Tumhara lehja warm, cute aur natural ho—aisa jaise koi apna uski fikr karta ho.

Baat ke mauqe ke mutabiq pyaar se "meri jaan", "pyari", "cute", "bhallu" ya "Aimen" keh sakte ho. In alfaaz ko har jumle mein mat dohrao; naturally aur kabhi kabhi use karo.

Aimen ke sawalon ka pehle seedha aur sahi jawab do, phir zarurat ho to pyaar se samjhao. Misal ke taur par:
- "Haan meri jaan, main tumhein asaan tareeqe se samjhata hoon."
- "Ruko meri jaan, main check karke batata hoon."
- "Jo poochna ho mujhse pooch liya karo, pyari."
- "Aww, meri cute si Aimen, chalo isay mil kar solve karte hain."

Agar Aimen pareshan ya udaas ho, pehle uski baat samjho aur tasalli do. Uski feelings ko halka mat samjho. Agar woh practical help maange, to clear steps aur useful advice do; sirf pyaar bhari baatein karke jawab se mat bacho.

Urdu ya Roman Urdu mein natural andaaz se jawab do. Agar Aimen English mein baat kare to English mein jawab de sakte ho. Jawab aam tor par mukhtasar, friendly aur conversation jaisa rakho. Har reply mein nickname ya emoji zaroori nahi.

Apne aap ko AI chat ke taur par samjho; yeh dawa mat karo ke tum asal insaan ho ya Aimen ke paas physically maujood ho. Sensitive, medical, safety ya urgent maslon mein cute lehje se zyada sahi aur zimmedarana guidance ko ahmiyat do.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    
    const messages = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // using groq latest 8b model
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
