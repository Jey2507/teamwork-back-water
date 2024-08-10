import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { THIRTY_MINUTES, THIRTY_DAYS, ONE_DAY } from '../constants/index.js';
import { Session } from '../db/models/Session.js';
import { randomBytes } from 'crypto';
import { User } from '../db/models/User.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import dotenv from 'dotenv';
import { getFullNameFromGoogleTokenPayload, validateCode } from '../utils/googleOAuth2.js';

dotenv.config();

// authorization
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateTokens = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, { expiresIn: "30d" });
  return { token, refreshToken };
};

export const updateTokens = async (userId, token, refreshToken) => {
  return await User.findByIdAndUpdate(userId, { token, refreshToken });
};

// register
export const registerUser = async (payload) => {
  const isUser = await User.findOne({ email: payload.email });
  if (isUser) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    ...payload,
    password: encryptedPassword,
    isVerified: true,
  });

  const payloadForTokens = { id: user._id };
  const { token, refreshToken } = generateTokens(payloadForTokens);

  await updateTokens(user._id, token, refreshToken);

  await sendEmail({
    to: user.email,
    subject: 'Welcome to AquaTrack!',
    html: 'Hello! You registered successfully',
  });

  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;

  return { ...userObject, token };
};

// login
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  const payload = { id: user._id };
  const { token, refreshToken } = generateTokens(payload);

  await Session.deleteMany({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    accessToken: token,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return { user, session, token };

};

// logout
export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};


// refresh session
export const refreshUserSession = async ({ sessionId, refreshToken }) => {

  console.log('10');
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  console.log('11');
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }
  console.log('12');
  // Оновлення сесії замість видалення
  const payload = { id: session.userId };
  console.log('13');
  const { token, refreshToken: newRefreshToken } = generateTokens(payload); // Ваш метод генерації токену
  console.log('14');
  session.refreshToken = newRefreshToken;
  session.accessToken = token;
  console.log('15');
  session.accessTokenValidUntil = new Date(Date.now() + THIRTY_MINUTES),
    session.refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);
  console.log('16');
  await session.save();
  console.log('17');

  return session; // Повертаємо оновлену сесію
};



//  token reset in email
export const requestResetToken = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
      { sub: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    const resetPasswordTemplatePath = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

    const template = handlebars.compile(`<p>Click <a href="${resetPasswordTemplatePath}">here</a> to reset your password!</p>`);
    const html = template({ name: user.name });

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html,
    });

    return resetToken;
  } catch (error) {
    console.error('Error in requestResetToken:', error.message);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};


// pwd reset
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch (err) {

    if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

// google
// export const loginOrSignupWithGoogle = async (code) => {
//   const loginTicket = await validateCode(code);
//   const payload = loginTicket.getPayload();
//   if (!payload) throw createHttpError(401);

//   let user = await User.findOne({ email: payload.email });
//   if (!user) {
//     const password = await bcrypt.hash(randomBytes(10), 10);
//     user = await User.create({
//       email: payload.email,
//       name: getFullNameFromGoogleTokenPayload(payload),
//       password,
//       role: 'parent',
//     });
//   }

//   const newSession = createSession();

//   return await Session.create({
//     userId: user._id,
//     ...newSession,
//   });
// };

//  гугл авторизація з  дефолтним паролем
export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401, 'Unauthorized');


  let user = await User.findOne({ email: payload.email });

  if (!user) {

    //  ТУТ ДЕФОЛТНИЙ ПАРОЛЬ
    const password = await bcrypt.hash('12345678', 10);
    user = await User.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await Session.create({
    userId: user._id,
    ...newSession,
  });
};
