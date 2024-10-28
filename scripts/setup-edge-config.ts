import { config } from '../src/lib/edge-config';

async function setupEdgeConfig() {
  try {
    // Check if data exists
    const posts = await config.get('posts');
    const users = await config.get('users');
    const subreddits = await config.get('subreddits');

    // Initialize if empty
    if (!posts) await config.set('posts', []);
    if (!users) await config.set('users', []);
    if (!subreddits) await config.set('subreddits', []);

    console.log('Edge Config initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Edge Config:', error);
  }
}

setupEdgeConfig();