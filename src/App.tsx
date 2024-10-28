import React from 'react';
import { Header } from './components/Header';
import { CreatePost } from './components/CreatePost';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { LeftSidebar } from './components/LeftSidebar';
import { usePosts } from './store/posts';
import { useEffect } from 'react';

function Feed() {
  const { posts, fetchPosts } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex-1 space-y-4">
      <CreatePost />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-6">
          <LeftSidebar />
          <Feed />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;