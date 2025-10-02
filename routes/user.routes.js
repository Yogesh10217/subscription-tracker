import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import {getUser, getUsers} from '../controllers/user.controller.js';
const userRouter = Router();


//GET/Users-> getr all users
//GET/Users/:id -> get user by id
//POST/Users -> create a new user
//PUT/Users/:id -> update user by id
//DELETE/Users/:id -> delete user by id

userRouter.get('/', getUsers);
userRouter.get('/:id',authorize,getUser);
userRouter.post('/', (req, res) => res.send({ title: 'CREATE new  users' }));
userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE  users' }));
userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE all users' }));

export default userRouter;