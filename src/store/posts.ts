import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  subreddit: string;
  user_id: string;
  created_at: string;
  votes: number;
  comments: Comment[];
  profiles: { username: string };
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: { username: string };
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (post: { title: string; content: string; subreddit: string }) => Promise<void>;
  votePost: (postId: string, value: number) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
}

export const usePosts = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id(username),
          comments(
            *,
            profiles:user_id(username)
          )
        `)
        .order('created_at', { ascending: false });
      set({ posts: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (post) => {
    try {
      set({ loading: true, error: null });
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data } = await supabase
        .from('posts')
        .insert({
          ...post,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (data) {
        const posts = get().posts;
        set({ posts: [data, ...posts] });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  votePost: async (postId, value) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      await supabase
        .from('votes')
        .upsert({
          post_id: postId,
          user_id: userData.user.id,
          value,
        });

      // Refresh posts to get updated vote count
      get().fetchPosts();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addComment: async (postId, content) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userData.user.id,
          content,
        })
        .select()
        .single();

      if (data) {
        const posts = get().posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, data],
            };
          }
          return post;
        });
        set({ posts });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));