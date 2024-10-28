import { Post, Comment, User } from '../types';

const API_BASE = '/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Posts
export const getPosts = (sort = 'new', subreddit?: string, search?: string) => {
  const params = new URLSearchParams();
  if (sort) params.append('sort', sort);
  if (subreddit) params.append('subreddit', subreddit);
  if (search) params.append('search', search);
  
  return fetchAPI<Post[]>(`/posts?${params.toString()}`);
};

export const createPost = (data: { title: string; content: string; subreddit: string }) => {
  return fetchAPI<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Auth
export const login = (username: string, password: string) => {
  return fetchAPI<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const register = (username: string, password: string) => {
  return fetchAPI<{ token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

// Comments
export const addComment = (postId: string, content: string) => {
  return fetchAPI<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

// Votes
export const votePost = (postId: string, value: number) => {
  return fetchAPI<Post>(`/posts/${postId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ value }),
  });
};

// Subreddits
export const joinSubreddit = (subreddit: string) => {
  return fetchAPI<{ success: boolean }>(`/subreddits/${subreddit}/join`, {
    method: 'POST',
  });
};