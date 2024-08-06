import Joi from "joi";

export const addWaterSchema = Joi.object({
    date: Joi.string(),
    amount: Joi.number().required(),
  });

export const updateWaterSchema = Joi.object({
    amount: Joi.number(),
    date: Joi.string(),
  });