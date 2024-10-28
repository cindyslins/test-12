export interface User {
  id: string;
  username: string;
  avatar?: string;
  karma: number;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  subreddit: string;
  votes: number;
  comments: Comment[];
  createdAt: Date;
  image?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  votes: number;
  createdAt: Date;
  replies: Comment[];
}

export interface Subreddit {
  name: string;
  description: string;
  members: number;
  icon?: string;
}