import { getEdgeConfigValue, setEdgeConfigValue } from '../../src/lib/edge-config';
import type { Post } from '../../src/types';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const posts = await getEdgeConfigValue<Post>('posts');
      const { sort, subreddit, search } = req.query;
      
      let filteredPosts = [...posts];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
        );
      }
      
      if (subreddit) {
        filteredPosts = filteredPosts.filter(post => post.subreddit === subreddit);
      }
      
      if (sort === 'top') {
        filteredPosts.sort((a, b) => b.votes - a.votes);
      } else {
        filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      
      res.status(200).json(filteredPosts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else if (req.method === 'POST') {
    try {
      const posts = await getEdgeConfigValue<Post>('posts');
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        ...req.body,
        votes: 0,
        comments: [],
        createdAt: new Date(),
        author: {
          id: req.headers['x-user-id'] as string,
          username: 'anonymous',
          karma: 0,
          createdAt: new Date()
        }
      };
      
      await setEdgeConfigValue('posts', [...posts, newPost]);
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}