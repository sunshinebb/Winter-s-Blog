
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../services/storageService';
import { summarizeContent, generateCoverImage } from '../services/geminiService';
import { BlogPost } from '../types';

const Admin: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'posts' | 'moments' | 'settings'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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
      tags: ['Life'],
      coverImage: ''
    });
    setIsEditorOpen(true);
  };

  const handleGenerateCover = async () => {
    if (!editingPost?.title) return;
    setIsGeneratingImage(true);
    try {
      const prompt = `${editingPost.title}. ${editingPost.content?.slice(0, 200)}`;
      const imageUrl = await generateCoverImage(prompt);
      if (imageUrl) {
        setEditingPost(prev => prev ? { ...prev, coverImage: imageUrl } : null);
      }
    } catch (error) {
      console.error("Cover generation failed", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingPost(prev => prev ? { ...prev, coverImage: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
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
      coverImage: editingPost.coverImage,
    };

    storage.savePost(postToSave);
    setPosts(storage.getPosts());
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-800">{t('admin.title')}</h2>
        <div className="flex flex-wrap gap-3">
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
          <div className="p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search posts by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>

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
                  {filteredPosts.map(post => (
                    <tr key={post.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.coverImage || `https://picsum.photos/seed/${post.id}/50/50`} 
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shadow-sm"
                            alt=""
                          />
                          <p className="font-semibold text-slate-800">{post.title}</p>
                        </div>
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
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                        {posts.length === 0 ? "No posts found. Start writing in the Thoughts section." : "No posts match your search."}
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
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
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
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Post Data */}
                <div className="md:col-span-2 space-y-4">
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

                {/* Right Column: Cover Image */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cover Image</label>
                  <div className="relative group aspect-square md:aspect-auto md:h-64 rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                    {editingPost.coverImage ? (
                      <>
                        <img src={editingPost.coverImage} className="w-full h-full object-cover" alt="Cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setEditingPost({...editingPost, coverImage: ''})}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-image text-4xl text-slate-300"></i>
                        <p className="text-[10px] text-slate-400 text-center px-4">No cover image set</p>
                      </>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={handleGenerateCover}
                      disabled={isGeneratingImage || !editingPost.title}
                      className="bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingImage ? (
                        <>
                          <i className="fa-solid fa-circle-notch animate-spin"></i>
                          AI...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-wand-magic-sparkles"></i>
                          AI Cover
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 hover:bg-slate-200 transition-colors"
                    >
                      <i className="fa-solid fa-upload"></i>
                      Upload
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                  />
                  <p className="text-[9px] text-slate-400 text-center leading-tight">
                    Generate with Gemini or upload your own creative cover.
                  </p>
                </div>
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
                disabled={isSummarizing || isGeneratingImage || !editingPost.title || !editingPost.content}
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
