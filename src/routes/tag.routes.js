import { Router } from 'express';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tag.controller.js';
import validateTag from '../validators/tag.validator.js';
import authMiddleware from '../middleware/auth.middleware.js';

const tagRouter = Router();

tagRouter.use(authMiddleware);

tagRouter.get('/', getTags);
tagRouter.post('/', validateTag, createTag);
tagRouter.put('/:id', validateTag, updateTag);
tagRouter.delete('/:id', deleteTag);

export default tagRouter;
