import { createClient } from '@vercel/edge-config';
import type { Post, User, Subreddit } from '../types';

interface EdgeConfigData {
  posts: Post[];
  users: User[];
  subreddits: Subreddit[];
}

// Using your provided Edge Config token
const EDGE_CONFIG = {
  token: '6b9f5d9a-c5c0-4da6-91c3-eb1fcccb0cb8'
};

export const config = createClient(EDGE_CONFIG);

const DEFAULT_DATA: EdgeConfigData = {
  posts: [],
  users: [],
  subreddits: []
};

export async function getEdgeConfigValue<K extends keyof EdgeConfigData>(key: K): Promise<EdgeConfigData[K]> {
  try {
    const value = await config.get(key);
    return (value || DEFAULT_DATA[key]) as EdgeConfigData[K];
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return DEFAULT_DATA[key];
  }
}

export async function setEdgeConfigValue<K extends keyof EdgeConfigData>(
  key: K,
  value: EdgeConfigData[K]
): Promise<void> {
  try {
    await config.set(key, value);
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
}