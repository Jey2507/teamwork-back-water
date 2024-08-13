import { Router } from 'express';
import multer from 'multer';
import {authenticate} from '../middlewares/authenticate.js';
import { getUserController } from '../controllers/user.js';
import { patchUserController } from '../controllers/user.js';
import { getAllUsersController } from '../controllers/user.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';


const userRouter = Router();

const upload = multer({ dest: 'uploads/' });

userRouter.get('/', authenticate, ctrlWrapper(getUserController));

userRouter.patch('/update', authenticate, upload.single('avatar'), ctrlWrapper(patchUserController));

userRouter.get('/all', authenticate, ctrlWrapper(getAllUsersController));

export default userRouter;
