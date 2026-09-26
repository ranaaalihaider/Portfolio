'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function ChatSettings() {
  const [apiKey, setApiKey] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/chat-settings')
      .then(res => res.json())
      .then(data => {
        setApiKey(data.apiKey || '');
        setSystemMessage(data.systemMessage || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/chat-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, systemMessage })
      });
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      setMessage('Error saving settings: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse">Loading settings...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Chat Settings</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Groq API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="gsk_..."
          />
          <p className="text-xs text-gray-500 mt-1">Get your API key from console.groq.com</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">System Message</label>
          <textarea
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="You are a helpful assistant..."
          />
          <p className="text-xs text-gray-500 mt-1">This context will be injected into every conversation in the chat section.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        {message && <p className={`text-sm font-medium ${message.includes('Error') || message.includes('Failed') ? 'text-red-500' : 'text-emerald-600'}`}>{message}</p>}
      </div>
    </div>
  );
}
