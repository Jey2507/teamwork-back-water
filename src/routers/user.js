import { Router } from 'express';
import multer from 'multer';
import {authenticate} from '../middlewares/authenticate.js';
import { getUserController } from '../controllers/user.js';
import { patchUserController } from '../controllers/user.js';


const userRouter = Router();

const upload = multer({ dest: 'uploads/' });

userRouter.get('/', authenticate, getUserController);

userRouter.patch('/update', authenticate, upload.single('avatar'), patchUserController);

export default userRouter;
