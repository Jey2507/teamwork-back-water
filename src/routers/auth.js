import { Router } from 'express';
import  validateBody  from '../utils/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
} from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import  ctrlWrapper  from '../utils/ctrlWrapper.js';

// import { authenticate } from '../middlewares/authenticate.js'; // коли робити ? при рефреш, при гет на персональні дані та апдейт????

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));


export default authRouter;
