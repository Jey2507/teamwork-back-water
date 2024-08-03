import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { refreshUserSession } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';


// register
export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


// login
export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, session, token } = await loginUser(email, password);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
      email: user.email,
      name: user.name,
      gender: user.gender,
      weight: user.weight,
      dailyTimeActivity: user.dailyTimeActivity,
      dailyNorma: user.dailyNorma,
      avatar: user.avatar,
      token,
      refreshToken: session.refreshToken,
    });

  } catch (error) {
    next(error);
  }
};
// logout
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);

    console.log('User logged out successfully');
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};


// session
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};


// refresh
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
