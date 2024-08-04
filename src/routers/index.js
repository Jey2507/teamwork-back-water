import { Router } from 'express';
import authRouter from './auth.js';
import waterRouter from './water.js';


const router = Router();

router.use('/water', waterRouter );

router.use('/auth', authRouter);

export default router;
