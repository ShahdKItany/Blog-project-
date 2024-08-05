// src/modules/comment/comment.router.js

import { Router } from 'express';
import commentModel from '../../../DB/model/comment.model.js';
import jwt from 'jsonwebtoken';

const app = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'soso';

// Add a comment
app.post('/', async (req, res) => {
  const { description, blogId } = req.body;
  const { token } = req.headers;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const newComment = new commentModel({ description, userId, blogId });
    await newComment.save();
    return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Get all comments for a specific blog
app.get('/:blogId', async (req, res) => {
  const { blogId } = req.params;

  try {
    const comments = await commentModel.find({ blogId }).populate('userId', 'name');
    return res.status(200).json({ message: 'Success', comments });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Admin: Update a comment
app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const { token } = req.headers;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedComment = await commentModel.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json({ message: 'Comment updated successfully', comment: updatedComment });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
});

// Admin: Delete a comment
app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { token } = req.headers;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const deletedComment = await commentModel.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

export default app;
