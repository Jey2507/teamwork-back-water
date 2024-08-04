import { Router } from 'express';
import { addWaterController, dailyWaterController, deleteWaterController, monthlyWaterController, updateWaterController, } from '../controllers/water.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { addWaterSchema, updateWaterSchema } from '../validation/water.js';
import { authenticate } from '../middlewares/authenticate.js';

const waterRouter = Router();

waterRouter.use('/', authenticate);

waterRouter.post('/add-water',validateBody(addWaterSchema), ctrlWrapper(addWaterController));

waterRouter.delete('/delete-water/:id', ctrlWrapper(deleteWaterController));

waterRouter.patch('/update-water/:id',validateBody(updateWaterSchema), ctrlWrapper(updateWaterController));

waterRouter.get('/daily-water', ctrlWrapper(dailyWaterController));

waterRouter.get('/monthly-water', ctrlWrapper(monthlyWaterController));

export default waterRouter;
