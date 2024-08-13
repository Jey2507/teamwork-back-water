import { User } from '../db/models/User.js';

//   update user
export const updateUser = async (userId, payload, options = {}) => {
  const rawResult = await User.findOneAndUpdate(
    { _id: userId },
    payload,
    {
      new: true,
      ...options,
    }
  );

  if (!rawResult) return null;


  const { refreshToken, ...userWithoutRefreshToken } = rawResult.toObject();

  return {
    user: userWithoutRefreshToken,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};


// get all users
export const getAllUsers = async () => {
  try {
    const count = await User.countDocuments(); 
    return count;
  } catch (error) {
    throw new Error('Error counting users');
  }
};
