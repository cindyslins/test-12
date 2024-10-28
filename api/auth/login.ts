import { getEdgeConfigValue } from '../../src/lib/edge-config';
import { SignJWT } from 'jose';
import type { User } from '../../src/types';

// Using your provided JWT secret
const JWT_SECRET = '123erwsdghyf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    const users = await getEdgeConfigValue<User>('users');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        karma: user.karma 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
}