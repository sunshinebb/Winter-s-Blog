
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-12">
      <section className="text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-indigo-500 rounded-full animate-pulse blur-xl opacity-20"></div>
          <img 
            src="https://picsum.photos/seed/curator/400/400" 
            className="relative w-full h-full rounded-full border-4 border-white shadow-xl object-cover" 
            alt="Alex Chen" 
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Alex Chen</h2>
          <p className="text-indigo-600 font-medium text-sm">Digital Product Designer & Creative Writer</p>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">{t('about.story')}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">
          I started ZenLog as a digital sanctuary—a place to organize the chaotic flow of inspiration I encounter every day. As a designer, I've always been fascinated by the intersection of aesthetics and functionality. This blog is my experiment in merging personal expression with AI-enhanced creativity.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-4">
          <h4 className="font-bold text-lg">{t('about.setup')}</h4>
          <ul className="space-y-3 text-slate-400 text-[10px] uppercase tracking-wider">
            <li className="flex justify-between"><span>Monitor</span> <span className="text-white">Studio Display</span></li>
            <li className="flex justify-between"><span>Keyboard</span> <span className="text-white">HHKB Hybrid</span></li>
            <li className="flex justify-between"><span>Editor</span> <span className="text-white">VS Code</span></li>
          </ul>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-4">
          <h4 className="font-bold text-lg text-slate-800">{t('about.interests')}</h4>
          <div className="flex flex-wrap gap-2">
            {['Generative AI', 'Minimalist Architecture', 'Coffee'].map(tag => (
              <span key={tag} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-semibold border border-slate-100">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center pt-8">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:scale-105 transition-transform text-sm">
          {t('about.collaborate')}
        </button>
      </div>
    </div>
  );
};

export default About;
