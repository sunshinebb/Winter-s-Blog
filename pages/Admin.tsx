
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../services/storageService';
import { summarizeContent } from '../services/geminiService';
import { BlogPost } from '../types';

const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'posts' | 'moments' | 'settings'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    setPosts(storage.getPosts());
  }, []);

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure?')) {
      storage.deletePost(id);
      setPosts(storage.getPosts());
    }
  };

  const handleOpenEditor = (post?: BlogPost) => {
    setEditingPost(post || {
      title: '',
      category: 'General',
      content: '',
      excerpt: '',
      tags: ['Life']
    });
    setIsEditorOpen(true);
  };

  const handleSavePost = async () => {
    if (!editingPost?.title || !editingPost?.content) return;

    let finalExcerpt = editingPost.excerpt || '';
    
    // Auto-generate excerpt if missing
    if (!finalExcerpt.trim()) {
      setIsSummarizing(true);
      try {
        const summary = await summarizeContent(editingPost.content);
        finalExcerpt = summary || editingPost.content.slice(0, 100) + '...';
      } catch (error) {
        console.error("Failed to generate summary:", error);
        finalExcerpt = editingPost.content.slice(0, 100) + '...';
      } finally {
        setIsSummarizing(false);
      }
    }

    const postToSave: BlogPost = {
      id: editingPost.id || Date.now().toString(),
      title: editingPost.title,
      content: editingPost.content,
      excerpt: finalExcerpt,
      category: editingPost.category || 'General',
      date: editingPost.date || new Date().toLocaleDateString(),
      tags: editingPost.tags || ['Life'],
    };

    storage.savePost(postToSave);
    setPosts(storage.getPosts());
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-800">{t('admin.title')}</h2>
        <div className="flex gap-3">
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
          {activeTab === 'posts' && (
            <button 
              onClick={() => handleOpenEditor()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              <span className="hidden sm:inline">New Post</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {activeTab === 'posts' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 px-4 font-bold text-slate-600 text-sm">Title</th>
                    <th className="py-4 px-4 font-bold text-slate-600 text-sm">Category</th>
                    <th className="py-4 px-4 font-bold text-slate-600 text-sm">Excerpt</th>
                    <th className="py-4 px-4 font-bold text-slate-600 text-sm">Date</th>
                    <th className="py-4 px-4 font-bold text-slate-600 text-sm text-center">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {posts.map(post => (
                    <tr key={post.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">{post.title}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                          {post.category || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-slate-500 line-clamp-2 max-w-[200px] md:max-w-xs">
                          {post.excerpt}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-500 whitespace-nowrap">
                        {post.date}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleOpenEditor(post)}
                            className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" 
                            title={t('common.edit')}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('common.delete')}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                        No posts found. Start writing in the Thoughts section.
                      </td>
                    </tr>
                  )}
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

      {/* Editor Modal */}
      {isEditorOpen && editingPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
              <h3 className="text-xl font-bold text-slate-800">
                {editingPost.id ? 'Edit Thought' : 'New Thought'}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                  <input 
                    type="text" 
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                    placeholder="Capture your idea..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select 
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Travel">Travel</option>
                    <option value="Technology">Technology</option>
                    <option value="Life">Life</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Content</label>
                <textarea 
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                  placeholder="Tell your story..." 
                  className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-sans leading-relaxed"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Excerpt (Optional)</label>
                  <span className="text-[10px] text-indigo-500 font-medium italic">Empty for AI summary</span>
                </div>
                <textarea 
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                  placeholder="A brief summary for previews..." 
                  className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-xs"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setIsEditorOpen(false)} 
                className="px-6 py-2 text-slate-600 font-semibold hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePost}
                disabled={isSummarizing || !editingPost.title || !editingPost.content}
                className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSummarizing ? (
                  <>
                    <i className="fa-solid fa-sparkles animate-pulse"></i>
                    AI Summarizing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    {editingPost.id ? 'Update' : 'Publish'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
