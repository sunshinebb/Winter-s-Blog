
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems: NavigationItem[] = [
    { name: t('nav.home'), path: '/', icon: 'fa-house' },
    { name: t('nav.thoughts'), path: '/thoughts', icon: 'fa-feather' },
    { name: t('nav.moments'), path: '/moments', icon: 'fa-camera-retro' },
    { name: t('nav.gallery'), path: '/gallery', icon: 'fa-images' },
    { name: t('nav.about'), path: '/about', icon: 'fa-user' },
    { name: t('nav.admin'), path: '/admin', icon: 'fa-gauge-high' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={toggle}
        />
      )}
      
      <div className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 flex flex-col`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ZenLog
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Digital Sanctuary</p>
        </div>

        <nav className="mt-6 px-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 768) toggle(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-[10px]">
            <button 
              onClick={() => setLanguage('zh')}
              className={`flex-1 font-bold py-1.5 rounded-lg transition-all ${language === 'zh' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              中文
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`flex-1 font-bold py-1.5 rounded-lg transition-all ${language === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              EN
            </button>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <img src="https://picsum.photos/seed/admin/40" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Profile" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Alex Chen</p>
                <p className="text-[10px] text-slate-500">{t('sidebar.curator')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          <h1 className="text-xl font-bold text-indigo-600">ZenLog</h1>
          <div className="w-8"></div>
        </header>
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
