import { getEdgeConfigValue, setEdgeConfigValue } from '../../../src/lib/edge-config';
import type { Post, Comment } from '../../../src/types';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postId } = req.query;
    const { content } = req.body;
    const posts = await getEdgeConfigValue('posts');
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: {
        id: req.headers['x-user-id'] as string,
        username: 'anonymous',
        karma: 0,
        createdAt: new Date()
      },
      votes: 0,
      createdAt: new Date(),
      replies: []
    };

    posts[postIndex].comments.push(newComment);
    await setEdgeConfigValue('posts', posts);
    
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
}