
import { BlogPost, Moment, MediaItem } from '../types';

const KEYS = {
  POSTS: 'zenlog_posts',
  MOMENTS: 'zenlog_moments',
  GALLERY: 'zenlog_gallery'
};

export const storage = {
  getPosts: (): BlogPost[] => JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]'),
  savePost: (post: BlogPost) => {
    const posts = storage.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) posts[index] = post;
    else posts.unshift(post);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  },
  deletePost: (id: string) => {
    const posts = storage.getPosts().filter(p => p.id !== id);
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  },

  getMoments: (): Moment[] => JSON.parse(localStorage.getItem(KEYS.MOMENTS) || '[]'),
  saveMoment: (moment: Moment) => {
    const moments = storage.getMoments();
    moments.unshift(moment);
    localStorage.setItem(KEYS.MOMENTS, JSON.stringify(moments));
  },

  getGallery: (): MediaItem[] => JSON.parse(localStorage.getItem(KEYS.GALLERY) || '[]'),
  saveMedia: (item: MediaItem) => {
    const gallery = storage.getGallery();
    gallery.unshift(item);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
  }
};

// Initialize with some seed data if empty
if (storage.getPosts().length === 0) {
  storage.savePost({
    id: 'seed-1',
    title: 'Hello ZenLog',
    excerpt: 'Welcome to your new AI-powered digital sanctuary.',
    content: 'This is the start of something beautiful...',
    date: new Date().toLocaleDateString(),
    tags: ['Announcement'],
    category: 'Life'
  });
}
