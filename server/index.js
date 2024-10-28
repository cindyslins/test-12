import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        karma: 0,
      },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, karma: user.karma } });
  } catch (error) {
    res.status(400).json({ error: 'Username already taken' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, karma: user.karma } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Posts routes
app.get('/api/posts', async (req, res) => {
  const { sort = 'new', subreddit, search } = req.query;
  try {
    let where = {};
    
    if (subreddit) {
      where.subreddit = subreddit;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    
    const orderBy = sort === 'top' 
      ? { votes: 'desc' } 
      : sort === 'hot' 
        ? { comments: { _count: 'desc' } }
        : { createdAt: 'desc' };

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const postSchema = z.object({
      title: z.string().min(1),
      content: z.string(),
      subreddit: z.string().min(1),
    });

    const data = postSchema.parse(req.body);
    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: req.user.id,
        votes: 0,
      },
      include: {
        author: true,
      },
    });
    
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Comments routes
app.post('/api/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: req.user.id,
        postId,
        votes: 0,
      },
      include: {
        author: true,
      },
    });

    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Votes routes
app.post('/api/posts/:postId/vote', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { value } = req.body;

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        votes: {
          increment: value,
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Subreddit routes
app.post('/api/subreddits/:name/join', authenticateToken, async (req, res) => {
  try {
    const { name } = req.params;
    
    const subreddit = await prisma.subreddit.update({
      where: { name },
      data: {
        members: {
          increment: 1,
        },
      },
    });

    res.json(subreddit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});