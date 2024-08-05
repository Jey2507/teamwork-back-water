import { Router } from 'express';
import authRouter from './auth.js';
import waterRouter from './water.js';
import userRouter from './user.js';

const router = Router();

router.use('/water', waterRouter );

router.use('/auth', authRouter);

router.use('/user', userRouter);


export default router;
