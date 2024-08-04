import createHttpError from 'http-errors';
import { updateUser } from '../services/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import {saveFileToUploadDir} from '../utils/saveFileToUploadDir.js';


// get current user info
export const getUserController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }
    res.status(200).json({
      status: 200,
      message: 'User retrieved successfully',
      data: {
        email: user.email,
        name: user.name,
        gender: user.gender,
        weight: user.weight,
        dailyTimeActivity: user.dailyTimeActivity,
        dailyNorma: user.dailyNorma,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
};

 // update current user info
export const patchUserController = async (req, res, next) => {
  const userId = req.user._id;
  const { name, email, gender, weight, dailyTimeActivity, dailyNorma, avatar } = req.body;
  const photo = req.file;

  let photoUrl = null;

  if (photo) {
    try {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    } catch (error) {
      next(createHttpError(500, 'Failed to upload file', error));
      return;
    }
  }

  const payload = {
    name,
    email,
    gender,
    weight,
    dailyTimeActivity,
    dailyNorma,
    avatar: photoUrl || avatar
  };

  try {
    const result = await updateUser(userId, payload);

    if (!result) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated user!',
      data: result.user,
    });
  } catch (error) {
    next(error);
  }
};
