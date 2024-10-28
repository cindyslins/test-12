import { getEdgeConfigValue, setEdgeConfigValue } from '../../../src/lib/edge-config';
import type { Subreddit } from '../../../src/types';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.query;
    const subreddits = await getEdgeConfigValue('subreddits');
    
    const subredditIndex = subreddits.findIndex(s => s.name === name);
    if (subredditIndex === -1) {
      // Create new subreddit if it doesn't exist
      const newSubreddit: Subreddit = {
        name,
        description: '',
        members: 1,
        createdAt: new Date()
      };
      subreddits.push(newSubreddit);
    } else {
      subreddits[subredditIndex].members += 1;
    }

    await setEdgeConfigValue('subreddits', subreddits);
    res.status(200).json(subreddits[subredditIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join subreddit' });
  }
}