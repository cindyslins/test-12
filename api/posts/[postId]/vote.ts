import { getEdgeConfigValue, setEdgeConfigValue } from '../../../src/lib/edge-config';
import type { Post } from '../../../src/types';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postId } = req.query;
    const { value } = req.body;
    const posts = await getEdgeConfigValue('posts');
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    posts[postIndex].votes += value;
    await setEdgeConfigValue('posts', posts);
    
    res.status(200).json(posts[postIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote' });
  }
}