import Joi from "joi";

export const addWaterSchema = Joi.object({
    date: Joi.string().required(),
    amount: Joi.number().required(),
  });

export const updateWaterSchema = Joi.object({
    amount: Joi.number(),
    date: Joi.string(),
  });