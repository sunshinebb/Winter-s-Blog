
import React, { useState, useEffect } from 'react';
import { generateMoodEmoji } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../services/storageService';
import { Moment } from '../types';

const Moments: React.FC = () => {
  const { t } = useLanguage();
  const [momentText, setMomentText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    const data = storage.getMoments();
    if (data.length === 0) {
      setMoments([
        { id: '1', text: "Just saw the most beautiful sunset over the mountains. Life is good.", date: "Today, 6:45 PM", mood: "🌅", location: "Blue Ridge Parkway" },
        { id: '2', text: "Coffee spill on my favorite white shirt... classic Monday.", date: "Mon, 9:20 AM", mood: "☕️", location: "Downtown Cafe" },
      ]);
    } else {
      setMoments(data);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!momentText.trim()) return;

    setAnalyzing(true);
    try {
      const mood = await generateMoodEmoji(momentText);
      const newMoment: Moment = {
        id: Date.now().toString(),
        text: momentText,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: mood || "✨",
        location: "Current Location"
      };
      storage.saveMoment(newMoment);
      setMoments([newMoment, ...moments]);
      setMomentText('');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">{t('moments.title')}</h2>
        <p className="text-slate-500">{t('moments.desc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <textarea 
          value={momentText}
          onChange={(e) => setMomentText(e.target.value)}
          placeholder={t('moments.placeholder')} 
          className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-slate-400">
            <button type="button" className="hover:text-indigo-500 transition-colors"><i className="fa-solid fa-camera"></i></button>
            <button type="button" className="hover:text-indigo-500 transition-colors"><i className="fa-solid fa-location-dot"></i></button>
          </div>
          <button 
            type="submit"
            disabled={analyzing || !momentText.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 text-sm"
          >
            {analyzing ? t('moments.analyzing') : t('moments.share')}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {moments.map((m) => (
          <div key={m.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex gap-6 animate-in slide-in-from-bottom duration-500">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl shadow-inner border border-indigo-100">
              {m.mood}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{m.location}</span>
                <span className="text-[10px] text-slate-400">{m.date}</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium text-sm">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moments;
