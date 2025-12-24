
import React, { useState, useEffect } from 'react';
import { generateBlogOutline, summarizeContent } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../services/storageService';
import { BlogPost } from '../types';

const Thoughts: React.FC = () => {
  const { t } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [outline, setOutline] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(storage.getPosts());
  }, []);

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

  const handlePublish = async () => {
    if (!topic || !content) return;
    setIsPublishing(true);
    
    let excerpt = '';
    try {
      // Use AI for a better excerpt than just slicing
      excerpt = await summarizeContent(content) || content.slice(0, 150) + '...';
    } catch (error) {
      excerpt = content.slice(0, 150) + '...';
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: topic,
      excerpt: excerpt,
      content: content,
      date: new Date().toLocaleDateString(),
      tags: ['Life'],
      category: 'General'
    };
    
    storage.savePost(newPost);
    setPosts(storage.getPosts());
    setIsCreating(false);
    setIsPublishing(false);
    setTopic('');
    setContent('');
    setOutline('');
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

      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Draft New Thought</h3>
              <button 
                onClick={() => { setIsCreating(false); setOutline(''); setTopic(''); }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. The future of minimalist design..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  />
                  <button 
                    onClick={handleGenerateOutline}
                    disabled={loading}
                    className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'AI Spark'}
                  </button>
                </div>
              </div>

              {outline && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 max-h-40 overflow-y-auto">
                  <h4 className="text-[10px] font-bold text-indigo-600 uppercase mb-2">AI-Generated Outline</h4>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans">{outline}</pre>
                </div>
              )}

              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..." 
                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreating(false)} 
                className="px-4 py-2 text-slate-600 font-semibold"
                disabled={isPublishing}
              >
                Cancel
              </button>
              <button 
                onClick={handlePublish} 
                disabled={isPublishing || !topic || !content}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    Publishing...
                  </>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 h-48 md:h-64 rounded-2xl overflow-hidden bg-slate-100">
                <img src={`https://picsum.photos/seed/${post.id}/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                <p className="text-slate-500 mb-6 flex-1 line-clamp-3">{post.excerpt}</p>
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
