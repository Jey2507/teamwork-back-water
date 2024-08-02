import Joi from 'joi';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  // repeatPassword: Joi.string().min(8).required(), треба? чи тільки на фронті?
});

// в регістер ПОТРІБНА ВАЛІДАЦІЯ EMAIL ?????

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
