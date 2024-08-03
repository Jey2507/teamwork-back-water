import { User } from '../db/models/User.js';

// get user data
export const getUser = async (query) => {
  try {
    const user = await User.findOne(query);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(error, 'Error retrieving user information');
  }
};


//   update user
export const updateUser = async (userId, payload, options = {}) => {
    const rawResult = await User.findOneAndUpdate(
      { _id: userId },
      payload,
      {
        new: true,
        ...options,
      },
    );

    if (!rawResult) return null;

    return {
      user: rawResult,
      isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
  };
