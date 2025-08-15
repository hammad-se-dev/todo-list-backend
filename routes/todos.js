import express from 'express';
import Todo from '../models/Todo.js';
import { protect } from '../middleware/auth.js';
import { createTodoSchema, updateTodoSchema, validateRequest } from '../validations/todo.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Get all todos for current user
// @route   GET /api/todos
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status; // 'pending' or 'completed'
  const search = req.query.search; // search in title and content

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Build query
  let query = { userId: req.user.id };
  
  if (status) {
    query.status = status;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  const todos = await Todo.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Todo.countDocuments(query);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.json({
    success: true,
    count: todos.length,
    pagination,
    data: todos
  });
}));

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  res.json({
    success: true,
    data: todo
  });
}));

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
router.post('/', validateRequest(createTodoSchema), asyncHandler(async (req, res) => {
  const { title, content, status = 'pending' } = req.body;

  const todo = await Todo.create({
    title,
    content,
    status,
    userId: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Todo created successfully',
    data: todo
  });
}));

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
router.put('/:id', validateRequest(updateTodoSchema), asyncHandler(async (req, res) => {
  let todo = await Todo.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  // Update fields
  const { title, content, status } = req.body;
  
  if (title) todo.title = title;
  if (content) todo.content = content;
  if (status) todo.status = status;

  await todo.save();

  res.json({
    success: true,
    message: 'Todo updated successfully',
    data: todo
  });
}));

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  await todo.deleteOne();

  res.json({
    success: true,
    message: 'Todo deleted successfully'
  });
}));

// @desc    Toggle todo status
// @route   PATCH /api/todos/:id/toggle
// @access  Private
router.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  // Toggle status
  todo.status = todo.status === 'pending' ? 'completed' : 'pending';
  await todo.save();

  res.json({
    success: true,
    message: 'Todo status toggled successfully',
    data: todo
  });
}));

// @desc    Get todo statistics
// @route   GET /api/todos/stats/summary
// @access  Private
router.get('/stats/summary', asyncHandler(async (req, res) => {
  const totalTodos = await Todo.countDocuments({ userId: req.user.id });
  const completedTodos = await Todo.countDocuments({ 
    userId: req.user.id, 
    status: 'completed' 
  });
  const pendingTodos = await Todo.countDocuments({ 
    userId: req.user.id, 
    status: 'pending' 
  });

  const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  res.json({
    success: true,
    data: {
      total: totalTodos,
      completed: completedTodos,
      pending: pendingTodos,
      completionRate: Math.round(completionRate * 100) / 100
    }
  });
}));

export { router };
