import React, { useState } from 'react';
import { Image, Link } from 'lucide-react';
import { usePost } from '../context/PostContext';

export function CreatePost() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { dispatch } = usePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      author: 'user',
      subreddit: 'all',
      votes: 0,
      comments: [],
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_POST', payload: newPost });
    setTitle('');
    setContent('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <input
            type="text"
            placeholder="Create Post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={() => setIsExpanded(true)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isExpanded && (
          <>
            <textarea
              placeholder="What are your thoughts?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-24 p-2 mb-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button type="button" className="p-2 hover:bg-gray-100 rounded">
                  <Image className="h-5 w-5 text-gray-500" />
                </button>
                <button type="button" className="p-2 hover:bg-gray-100 rounded">
                  <Link className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}