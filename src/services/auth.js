import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { THIRTY_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { Session } from '../db/models/Session.js';
import { randomBytes } from 'crypto';
import { User } from '../db/models/User.js';
import { sendEmail } from '../utils/sendMail.js';


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

export const updateTokensForUser = async (userId, token, refreshToken) => {
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

  await updateTokensForUser(user._id, token, refreshToken);

  await sendEmail(user.email, 'Welcome to AquaTrack!', 'Hello! You registered successfully');

  return { ...user.toObject(), token, refreshToken };
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
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();
  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({ userId: session.userId, ...newSession });
};

