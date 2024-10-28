import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Post } from '../types';
import * as api from '../lib/api';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

type PostAction =
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'VOTE_POST'; payload: { id: string; value: number } }
  | { type: 'ADD_COMMENT'; payload: { postId: string; comment: Comment } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const PostContext = createContext<{
  state: PostState;
  dispatch: React.Dispatch<PostAction>;
  fetchPosts: (sort?: string, subreddit?: string, search?: string) => Promise<void>;
}>({
  state: { posts: [], loading: false, error: null },
  dispatch: () => null,
  fetchPosts: async () => {},
});

function postReducer(state: PostState, action: PostAction): PostState {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'VOTE_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id
            ? { ...post, votes: post.votes + action.payload.value }
            : post
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
                ...post,
                comments: [...post.comments, action.payload.comment],
              }
            : post
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(postReducer, {
    posts: [],
    loading: false,
    error: null,
  });

  const fetchPosts = async (sort = 'new', subreddit?: string, search?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const posts = await api.getPosts(sort, subreddit, search);
      dispatch({ type: 'SET_POSTS', payload: posts });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch posts' });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ state, dispatch, fetchPosts }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePost = () => useContext(PostContext);