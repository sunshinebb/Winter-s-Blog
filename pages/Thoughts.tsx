
import React, { useState } from 'react';
import { generateBlogOutline } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const Thoughts: React.FC = () => {
  const { t } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateOutline = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await generateBlogOutline(topic);
      setOutline(res || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{t('thoughts.title')}</h2>
          <p className="text-slate-500">{t('thoughts.desc')}</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> {t('thoughts.new_post')}
        </button>
      </div>

      <div className="space-y-6">
        {[
          { title: "Finding Balance in the Digital Age", date: "Oct 24, 2023", excerpt: "We spend 80% of our waking hours staring at screens. Is it possible to reclaim our focus?", tags: ["Focus", "Wellness"] },
          { title: "Minimalist Workspaces That Inspire", date: "Oct 12, 2023", excerpt: "Less clutter, more clarity. Here are 5 setups that changed the way I work.", tags: ["Setup", "Design"] },
        ].map((post, i) => (
          <article key={i} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 h-48 md:h-64 rounded-2xl overflow-hidden bg-slate-100">
                <img src={`https://picsum.photos/seed/${post.title}/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                <p className="text-slate-500 mb-6 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-slate-400 font-medium">{post.date}</span>
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                    {t('thoughts.read_more')} <i className="fa-solid fa-chevron-right text-[10px]"></i>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Thoughts;
