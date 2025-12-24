
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../services/storageService';
import { BlogPost } from '../types';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Get the 2 most recent posts
    const allPosts = storage.getPosts();
    setRecentPosts(allPosts.slice(0, 2));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl">
        <img 
          src="https://picsum.photos/id/1015/1200/400" 
          className="w-full h-full object-cover" 
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 md:p-12">
          <span className="bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">{t('home.hero.tag')}</span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{t('home.hero.title')}</h2>
          <p className="text-slate-200 text-xs md:text-base max-w-2xl line-clamp-2">{t('home.hero.desc')}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">{t('home.recent_thoughts')}</h3>
            <Link to="/thoughts" className="text-indigo-600 text-sm font-medium hover:underline">{t('home.view_all')}</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow h-full flex flex-col">
                <img 
                  src={post.coverImage || `https://picsum.photos/seed/${post.id}/400/250`} 
                  className="w-full h-40 object-cover rounded-xl mb-4" 
                  alt={post.title} 
                />
                <div className="text-[10px] text-indigo-500 font-semibold mb-2 uppercase tracking-wide">
                  {post.category || 'LIFE'} • {post.date}
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{post.title}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                <Link to="/thoughts" className="text-slate-800 text-sm font-bold flex items-center gap-2 group mt-auto">
                  {t('thoughts.read_more')} <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            )) : (
               <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                No recent thoughts yet.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Style Feed */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-slate-800">{t('home.quick_moments')}</h3>
          <div className="space-y-4">
            {[
              { text: "Morning coffee hits different today ☕️", mood: "✨", color: "bg-amber-50 text-amber-600" },
              { text: "Just finished reading 'The Alchemist'.", mood: "📖", color: "bg-blue-50 text-blue-600" },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4">
                <div className={`w-10 h-10 shrink-0 rounded-full ${m.color} flex items-center justify-center text-lg`}>
                  {m.mood}
                </div>
                <div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{m.text}</p>
                  <p className="text-[10px] text-slate-400 mt-1">2h ago</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white">
            <h4 className="font-bold mb-2">{t('home.ai_assistant')}</h4>
            <p className="text-[11px] text-indigo-100 mb-4">{t('home.ai_desc')}</p>
            <Link to="/thoughts" className="block w-full bg-white text-indigo-600 font-bold py-2 rounded-xl text-[12px] shadow-lg hover:bg-indigo-50 transition-colors text-center">
              {t('home.ai_btn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
