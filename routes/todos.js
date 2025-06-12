const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// Get all todos
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a todo
router.post('/', auth, async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      user: req.userId
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
