import Todo from '../models/todo.model.js';
import { AppError, asyncWrapper } from '../utils/errorHandler.js';

export const createTodo = asyncWrapper(async (req, res, next) => {
  const { title, description, status, priority } = req.body;

  if (!title) {
    return next(new AppError('Title is required', 400));
  }

  const todo = await Todo.create({
    title,
    description,
    status,
    priority,
    owner: req.user._id
  });

  res.status(201).json({
    success: true,
    todo
  });
});

export const getAllTodos = asyncWrapper(async (req, res, next) => {
  const { status, priority } = req.query;
  
  let query = {};

  if (req.user.role !== 'admin') {
    query.owner = req.user._id;
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  const todos = await Todo.find(query)
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: todos.length,
    todos
  });
});

export const getTodoById = asyncWrapper(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id).populate('owner', 'name email');

  if (!todo) {
    return next(new AppError('Todo not found', 404));
  }

  if (req.user.role !== 'admin' && todo.owner._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to access this todo', 403));
  }

  res.status(200).json({
    success: true,
    todo
  });
});

export const updateTodo = asyncWrapper(async (req, res, next) => {
  let todo = await Todo.findById(req.params.id);

  if (!todo) {
    return next(new AppError('Todo not found', 404));
  }

  if (req.user.role !== 'admin' && todo.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to update this todo', 403));
  }

  const { title, description, status, priority } = req.body;
  
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;

  todo = await Todo.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('owner', 'name email');

  res.status(200).json({
    success: true,
    todo
  });
});

export const deleteTodo = asyncWrapper(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return next(new AppError('Todo not found', 404));
  }

  if (req.user.role !== 'admin' && todo.owner.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to delete this todo', 403));
  }

  await Todo.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Todo deleted successfully'
  });
});
