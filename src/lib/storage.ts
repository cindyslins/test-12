import { Post, User, Subreddit } from '../types';

// Initialize default data
const DEFAULT_DATA = {
  posts: [] as Post[],
  users: [] as User[],
  subreddits: [] as Subreddit[]
};

// Initialize localStorage with default data if empty
Object.entries(DEFAULT_DATA).forEach(([key, value]) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
});

export function getData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : DEFAULT_DATA[key];
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return DEFAULT_DATA[key];
  }
}

export function setData(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
  }
}

// Auth helpers
export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}