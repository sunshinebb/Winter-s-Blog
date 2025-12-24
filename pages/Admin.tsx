
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../services/storageService';
import { BlogPost } from '../types';

const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'posts' | 'moments' | 'settings'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(storage.getPosts());
  }, []);

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure?')) {
      storage.deletePost(id);
      setPosts(storage.getPosts());
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">{t('admin.title')}</h2>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            {t('nav.thoughts')}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            {t('admin.settings')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {activeTab === 'posts' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 font-bold text-slate-600 text-sm">Title</th>
                    <th className="py-4 font-bold text-slate-600 text-sm">Date</th>
                    <th className="py-4 font-bold text-slate-600 text-sm">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {posts.map(post => (
                    <tr key={post.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <p className="font-semibold text-slate-800">{post.title}</p>
                        <p className="text-xs text-slate-400">{post.category}</p>
                      </td>
                      <td className="py-4 text-sm text-slate-500">{post.date}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800">Profile Settings</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Display Name</label>
                  <input type="text" defaultValue="Alex Chen" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bio</label>
                  <textarea rows={3} defaultValue="Curator & Dreamer" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800">System Info</h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500 flex justify-between"><span>Posts</span> <span className="font-bold">{posts.length}</span></p>
                  <p className="text-xs text-slate-500 flex justify-between mt-2"><span>Storage</span> <span className="font-bold">LocalStorage</span></p>
                  <p className="text-xs text-slate-500 flex justify-between mt-2"><span>AI Engine</span> <span className="font-bold">Gemini 3 Flash</span></p>
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
                  {t('common.save')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
