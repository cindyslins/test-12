import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Posts
export async function getPosts() {
  const { data, error } = await supabase
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

  if (error) throw error;
  return data;
}

export async function createPost(post: {
  title: string;
  content: string;
  subreddit: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...post,
      user_id: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function votePost(postId: string, value: number) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('votes')
    .upsert({
      post_id: postId,
      user_id: userData.user.id,
      value,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Comments
export async function createComment(postId: string, content: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userData.user.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Subreddits
export async function joinSubreddit(subreddit: string) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('subreddit_members')
    .insert({
      subreddit,
      user_id: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}