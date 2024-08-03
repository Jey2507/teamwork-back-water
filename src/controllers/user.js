import createHttpError from 'http-errors';
import { updateUser } from '../services/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import {saveFileToUploadDir} from '../utils/saveFileToUploadDir.js';
import { getUser } from '../services/user.js';

// get current user info
// export const getUserController = async (req, res, next) => {
//   try {
//     const email = req.user.email;
//     const user = await getUser(email);

//     res.json({
//       email: user.email,
//       name: user.name,
//       gender: user.gender,
//       weight: user.weight,
//       dailyTimeActivity: user.dailyTimeActivity,
//       dailyNorma: user.dailyNorma,
//       avatar: user.avatar,
//       isVerified: user.isVerified,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const getUserController = async (req, res, next) => {
  try {
       const query = req.query;
    const user = await getUser(query);

    res.json({
      email: user.email,
      name: user.name,
      gender: user.gender,
      weight: user.weight,
      dailyTimeActivity: user.dailyTimeActivity,
      dailyNorma: user.dailyNorma,
      avatar: user.avatar,
      isVerified: user.isVerified,
    });
  } catch (error) {
    next(error);
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
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
