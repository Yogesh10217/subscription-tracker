import { Router } from 'express';
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider
} from '../controllers/provider.controller.js';
import validateProvider from '../validators/provider.validator.js';
import authMiddleware from '../middleware/auth.middleware.js';

const providerRouter = Router();

providerRouter.use(authMiddleware);

providerRouter.get('/', getProviders);
providerRouter.post('/', validateProvider, createProvider);
providerRouter.put('/:id', validateProvider, updateProvider);
providerRouter.delete('/:id', deleteProvider);

export default providerRouter;
