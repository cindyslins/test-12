import React from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../types';
import { usePost } from '../context/PostContext';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { dispatch } = usePost();

  const handleVote = (value: number) => {
    dispatch({ type: 'VOTE_POST', payload: { id: post.id, value } });
  };

  return (
    <article className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        <div className="w-10 bg-gray-50 rounded-l-lg flex flex-col items-center py-2">
          <button
            onClick={() => handleVote(1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ArrowUp className="h-5 w-5 text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-800">{post.votes}</span>
          <button
            onClick={() => handleVote(-1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ArrowDown className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-3 flex-1">
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <span className="font-medium text-gray-900">r/{post.subreddit}</span>
            <span className="mx-1">•</span>
            <span>Posted by u/{post.author}</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(post.createdAt)} ago</span>
          </div>
          
          <h2 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h2>
          <p className="text-gray-800 mb-3">{post.content}</p>
          
          <div className="flex items-center space-x-4 text-gray-500">
            <button className="flex items-center space-x-1 hover:bg-gray-100 rounded px-2 py-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{post.comments.length} Comments</span>
            </button>
            <button className="flex items-center space-x-1 hover:bg-gray-100 rounded px-2 py-1">
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}