import express from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, restrictTo('admin'), getAllUsers);

export default router;
