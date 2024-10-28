import { getEdgeConfigValue, setEdgeConfigValue } from '../../src/lib/edge-config';
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
    
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      password,
      karma: 0,
      createdAt: new Date()
    };

    await setEdgeConfigValue('users', [...users, newUser]);
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ sub: newUser.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        karma: newUser.karma 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}