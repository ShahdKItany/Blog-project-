
// src/modules/user/user.router.js

import { Router } from 'express';
import userModel from '../../../DB/model/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = Router();

const JWT_SECRET = 'soso'; // Ensure to use environment variables for sensitive data

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


app.get('/', async (req, res) => {
  const { token } = req.headers;
  const decoded = jwt.verify(token, 'soso');
  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }

  try {
    if (decoded.name !== 'honey') {
      return res.status(403).json({ message: "Not authenticated user" });
    }

    const users = await userModel.findAll({
      attributes: ['name', 'email']
    });

    return res.status(200).json({ message: 'Success', users });
  } catch (error) {
  
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});



// Delete user route
app.delete('/:id', async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.name !== 'honey') {
      return res.status(403).json({ message: "Not authenticated user" });
    }

    const user = await userModel.destroy({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Attempt to update the user's name
    const [updatedRows] = await userModel.update(
      { name: name },
      {
        where: {
          id: id
        }
      }
    );

    // Check if any rows were updated
    if (updatedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Successfully updated
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    // Handle any errors that occur
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
});




export default app;




