
export type ContentType = 'thought' | 'moment' | 'media';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  coverImage?: string;
  category: string;
}

export interface Moment {
  id: string;
  text: string;
  date: string;
  location?: string;
  mood?: string;
  image?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  date: string;
  description?: string;
}

export interface NavigationItem {
  name: string;
  path: string;
  icon: string;
}
