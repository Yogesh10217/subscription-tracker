import {Router} from 'express';
const userRouter = Router();

//GET/Users-> getr all users
//GET/Users/:id -> get user by id
//POST/Users -> create a new user
//PUT/Users/:id -> update user by id
//DELETE/Users/:id -> delete user by id

userRouter.get('/', (req, res) => res.send({ title: 'GET all users' }));
userRouter.get('/:id', (req, res) => res.send({ title: 'GET  users details' }));
userRouter.post('/', (req, res) => res.send({ title: 'CREATE new  users' }));
userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE  users' }));
userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE all users' }));

export default userRouter;