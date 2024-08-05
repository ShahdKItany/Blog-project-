// src/modules/blog/blog.router.js

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import blogModel from '../../../DB/model/blog.model.js';

const app = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'soso';

// Create a new blog post
app.post('/', async (req, res) => {
  const { title, content } = req.body;

  try {
    const newBlog = new blogModel({ title, content });
    await newBlog.save();
    return res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

// Get all blog posts
app.get('/', async (req, res) => {
  try {
    const blogs = await blogModel.find({});
    return res.status(200).json({ message: 'Success', blogs });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// Get a single blog post by ID
app.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json({ message: 'Success', blog });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// Update a blog post by ID
app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
});

// Delete a blog post by ID
app.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await blogModel.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

export default app;
