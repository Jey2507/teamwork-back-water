import Joi from 'joi';
import { emailValidation } from '../constants/index.js';


export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});


export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailValidation).required().messages({
    'string.pattern.base': 'Invalid email format'
  }),
  password: Joi.string().min(8).max(22).required(),
});


export const emailUserSchema = Joi.object({
  email: Joi.string().pattern(emailValidation).required().messages({
    'string.pattern.base': 'Invalid email format'
  })
});


export const passwordUserSchema = Joi.object({
  resetToken: Joi.string().required(),
  password: Joi.string().min(8).max(22).required(),
});


export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});


export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
