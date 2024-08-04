import mongoose from 'mongoose';
import WaterConsumption from '../db/models/Water.js';
import moment from 'moment';

//  - - - - - - - - -CREATE WATER- - - - - - - - - 

export const addWater = async (userId, date, amount) => {
    return await WaterConsumption.create({
      userId: userId,
      date: date,
      amount,
    });
  };

  //  - - - - - - - - -CREATE WATER- - - - - - - - - 

  //  - - - - - - - - -DELETE WATER- - - - - - - - - 

  export const deleteWater = async (userId, id) => {
    return await WaterConsumption.findOneAndDelete({
      _id: id,
      userId: userId,
    });
  };

  //  - - - - - - - - -DELETE WATER- - - - - - - - - 

  //  - - - - - - - - -UPDATE WATER- - - - - - - - - 

  export const updateWater = async (userId, id, amount, date) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
  
    const mutableElement = await WaterConsumption.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    });
  
    if (!mutableElement) {
      return null;
    }
  
    let newDate;
    if (date) {
      const mutableElementObj = moment(mutableElement.date);
      const newTime = moment.tz(date, 'HH:mm', 'UTC');
  
      mutableElementObj.utc();
      mutableElementObj.set({
        hour: newTime.hour(),
        minute: newTime.minute(),
        second: 0,
        millisecond: 0,
      });
  
      newDate = mutableElementObj.toDate();
    }
  
    const updateFields = {
      date: newDate ? newDate : mutableElement.date,
      amount: amount !== undefined ? amount : mutableElement.amount,
    };
  
    return await WaterConsumption.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
  };

  //  - - - - - - - - -UPDATE WATER- - - - - - - - - 

    //  - - - - - - - - -DAILY WATER- - - - - - - - -

  export const dailyWater = async (userId, date) => {
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();
  
    const waterData = await WaterConsumption.find({
      userId: userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
  
    return waterData;
  };

    //  - - - - - - - - -DAILY WATER- - - - - - - - -

    //  - - - - - - - - -MONTHLY WATER- - - - - - - - -

  export const monthlyWater = async (userId, date) => {
    const startOfMonth = moment(date).startOf('month').toDate();
    const endOfMonth = moment(date).endOf('month').toDate();
  
    const waterData = await WaterConsumption.find({
      userId: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
  
    return waterData;
  };
  
    //  - - - - - - - - -MONTHLY WATER- - - - - - - - -