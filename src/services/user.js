import { User } from '../db/models/User.js';


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
