import { Router } from 'express';
import authRouter from './auth.js';
<<<<<<< HEAD
import waterRouter from './water.js';

=======
import userRouter from './user.js';
>>>>>>> origin/main

const router = Router();

router.use('/water', waterRouter );

router.use('/auth', authRouter);

router.use('/user', userRouter);


export default router;
