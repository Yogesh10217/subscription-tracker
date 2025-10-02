import {Router} from 'express';
import {signIn, signOut, signUp} from '../controllers/auth.controllers.js';

const authRouter=Router();
//path: /api/v1/auth/sign-up -> POST BODY -> {name,email,password}-> create new user
authRouter.post('/sign-up',signUp);

//path: /api/v1/auth/sign-in (post)
authRouter.post('/sign-in',signIn);
authRouter.post('/sign-out',signOut);

export default authRouter;;