import { Router } from 'express';
import { signIn, signUp } from '../controllers/auth.controller.js';
import { validateSignIn, validateSignUp } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post('/sign-up', validateSignUp, signUp);
authRouter.post('/sign-in', validateSignIn, signIn);

export default authRouter;
