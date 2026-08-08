import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import validateCategory from '../validators/category.validator.js';
import authMiddleware from '../middleware/auth.middleware.js';

const categoryRouter = Router();

categoryRouter.use(authMiddleware);

categoryRouter.get('/', getCategories);
categoryRouter.post('/', validateCategory, createCategory);
categoryRouter.put('/:id', validateCategory, updateCategory);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;
