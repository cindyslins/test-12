import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { Comment, Post } from '../types';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

interface CommentSectionProps {
  post: Post;
}

export function CommentSection({ post }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { dispatch } = usePost();
  const { user } = useAuth();

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: user,
      votes: 0,
      createdAt: new Date(),
      replies: [],
    };

    dispatch({
      type: 'ADD_COMMENT',
      payload: { postId: post.id, comment },
    });

    setNewComment('');
  };

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleSubmitComment} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "What are your thoughts?" : "Please login to comment"}
          disabled={!user}
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        {user && (
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            Comment
          </button>
        )}
      </form>

      <div className="space-y-4">
        {post.comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="font-medium text-gray-900">
                u/{comment.author.username}
              </span>
              <span>•</span>
              <span>{formatDistanceToNow(comment.createdAt)} ago</span>
            </div>
            <p className="mt-2 text-gray-800">{comment.content}</p>
            <div className="mt-2 flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <span className="text-xs font-medium">{comment.votes}</span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <button className="flex items-center space-x-1 text-xs hover:bg-gray-100 rounded px-2 py-1">
                <MessageSquare className="h-4 w-4" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}