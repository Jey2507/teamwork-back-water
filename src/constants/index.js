import dotenv from 'dotenv';

export const THIRTY_MINUTES = 30 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

dotenv.config();

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};
