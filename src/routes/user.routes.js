import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getUser, getUsers } from '../controllers/user.controller.js';
import { validateUserIdParam } from '../validators/user.validator.js';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', authMiddleware, validateUserIdParam, getUser);

export default userRouter;
