
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    'nav.home': '首页',
    'nav.thoughts': '思考',
    'nav.moments': '动态',
    'nav.gallery': '画廊',
    'nav.about': '关于',
    'nav.admin': '控制台',
    'sidebar.curator': '馆长 & 追梦人',
    'home.hero.tag': '最新文章',
    'home.hero.title': '快节奏世界中的正念生活艺术',
    'home.hero.desc': '如何退后一步，拥抱沉默，从而改变你的日常效率和心理清晰度。',
    'home.recent_thoughts': '近期思考',
    'home.view_all': '查看全部',
    'home.quick_moments': '瞬间动态',
    'home.ai_assistant': 'AI 写作助手',
    'home.ai_desc': '让 ZenLog 帮你寻找下一个故事的灵感。',
    'home.ai_btn': '激发新灵感',
    'thoughts.title': '思考',
    'thoughts.desc': '关于生活与技术的长篇感悟。',
    'thoughts.new_post': '撰写新文章',
    'thoughts.read_more': '阅读全文',
    'moments.title': '动态',
    'moments.desc': '日常生活的小片段与即时心情分析。',
    'moments.placeholder': '此刻在发生什么？',
    'moments.share': '分享瞬间',
    'moments.analyzing': '分析心情中...',
    'gallery.title': '视觉',
    'gallery.desc': '像素捕捉到的瞬间合集。',
    'gallery.add': '添加到画廊',
    'gallery.drag_drop': '拖放图片或视频到此处',
    'admin.title': '内容管理',
    'admin.manage_posts': '管理博文',
    'admin.manage_moments': '管理动态',
    'admin.manage_gallery': '管理画廊',
    'admin.settings': '站点配置',
    'admin.actions': '操作',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.save': '保存',
    'about.story': '我的故事',
    'about.collaborate': '开始协作',
    'about.setup': '当前配置',
    'about.interests': '兴趣爱好'
  },
  en: {
    'nav.home': 'Home',
    'nav.thoughts': 'Thoughts',
    'nav.moments': 'Moments',
    'nav.gallery': 'Gallery',
    'nav.about': 'About',
    'nav.admin': 'Admin',
    'sidebar.curator': 'Curator & Dreamer',
    'home.hero.tag': 'LATEST POST',
    'home.hero.title': 'The Art of Mindful Living in a Fast-Paced World',
    'home.hero.desc': 'How stepping back and embracing silence can transform your daily productivity and mental clarity.',
    'home.recent_thoughts': 'Recent Thoughts',
    'home.view_all': 'View All',
    'home.quick_moments': 'Quick Moments',
    'home.ai_assistant': 'AI Writing Assistant',
    'home.ai_desc': 'Let ZenLog help you find inspiration for your next story.',
    'home.ai_btn': 'Spark New Ideas',
    'thoughts.title': 'Thoughts',
    'thoughts.desc': 'Long-form reflections on life and technology.',
    'thoughts.new_post': 'New Post',
    'thoughts.read_more': 'Read Article',
    'moments.title': 'Moments',
    'moments.desc': 'Brief snippets of daily life and instant moods.',
    'moments.placeholder': "What's happening right now?",
    'moments.share': 'Share Moment',
    'moments.analyzing': 'Analyzing Mood...',
    'gallery.title': 'Visuals',
    'gallery.desc': 'A collection of moments captured in pixels.',
    'gallery.add': 'Add to Gallery',
    'gallery.drag_drop': 'Drag and drop images or videos here',
    'admin.title': 'Management Console',
    'admin.manage_posts': 'Manage Posts',
    'admin.manage_moments': 'Manage Moments',
    'admin.manage_gallery': 'Manage Gallery',
    'admin.settings': 'Site Settings',
    'admin.actions': 'Actions',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.save': 'Save',
    'about.story': 'My Story',
    'about.collaborate': "Let's Collaborate",
    'about.setup': 'Current Setup',
    'about.interests': 'Interests'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
