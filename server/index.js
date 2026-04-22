import express from "express";
import cors from "cors";
import path from "path";
import { prisma } from "./config/prisma.js";
import { env } from "./config/env.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = env.PORT || 8000;

// Enable CORS and JSON parsing
app.use(cors({ origin: ['http://localhost:  3000', 'http://localhost:8888'] }));
app.use(express.json());

// Route to get comments (filtered by blogId if provided)
app.get('/api/comments', async (req, res) => {
  const { blogId } = req.query;
  try {
    const comments = await prisma.comment.findMany({
      where: blogId ? { blogId } : {},
      orderBy: { createdAt: 'desc' }
    });
    res.json(comments);
  } catch (error) {
    console.error("GET /api/comments error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to post a new comment (stores raw input for XSS demo)
app.post('/api/comment', async (req, res) => {
  const { blogId, name, comment } = req.body;
  
  if (!blogId || !name || !comment) {
    return res.status(400).json({ error: 'blogId, name, and comment are required' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: { 
        blogId, 
        name, 
        comment // Raw input is intentionally not sanitized
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("POST /api/comment error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
