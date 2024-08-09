import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { refreshUserSession } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { loginOrSignupWithGoogle } from '../services/auth.js';

const setupResponseSession = (res, {refreshToken, _id})=> {
  res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
      sameSite: 'None'
    });
    res.cookie('sessionId', _id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
      sameSite: 'None'
    });
}

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

    setupResponseSession(res, session);
    
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data:
      {
        email: user.email,
        name: user.name,
        gender: user.gender,
        weight: user.weight,
        dailyTimeActivity: user.dailyTimeActivity,
        dailyNorma: user.dailyNorma,
        avatar: user.avatar,
        token,
      }
    });
  } catch (error) {
    next(error);
  }
};

// logout

export const logoutUserController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};



// refresh
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupResponseSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// token reset in email
export const requestResetEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Request received to send reset email for:', email);
    await requestResetToken(email);

    res.status(200).json({
      status: 200,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || 'Something went wrong',
    });
  }
};
// reset pwd
export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);
    res.status(200).json({
      status: 200,
      message: 'Password was successfully reset!',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.message,
    });
  }
};

// google
export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

// google login
export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
