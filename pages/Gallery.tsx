
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  const media = [
    { id: 1, type: 'photo', url: 'https://picsum.photos/id/10/800/800', title: 'Mountain Path' },
    { id: 2, type: 'photo', url: 'https://picsum.photos/id/20/800/800', title: 'Summer Lake' },
    { id: 3, type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Morning Dew', thumb: 'https://picsum.photos/id/30/800/800' },
  ];

  const filteredMedia = filter === 'all' ? media : media.filter(m => m.type === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{t('gallery.title')}</h2>
          <p className="text-slate-500">{t('gallery.desc')}</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
          {(['all', 'photo', 'video'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              {f}s
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm">
            <img 
              src={item.type === 'video' ? item.thumb : item.url} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={item.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white font-bold text-xs">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-indigo-400 transition-colors group cursor-pointer">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-50 transition-colors">
          <i className="fa-solid fa-cloud-arrow-up text-slate-400 text-xl group-hover:text-indigo-600"></i>
        </div>
        <h4 className="font-bold text-slate-800 text-sm">{t('gallery.add')}</h4>
        <p className="text-[10px] text-slate-400">{t('gallery.drag_drop')}</p>
      </div>
    </div>
  );
};

export default Gallery;
