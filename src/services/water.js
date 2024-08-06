import mongoose from 'mongoose';
import Water from '../db/models/Water.js';
import moment from 'moment';

//  - - - - - - - - -CREATE WATER- - - - - - - - - 

export const addWater = async (userId, date, amount) => {
    return await Water.create({
      userId: userId,
      date: date,
      amount,
    });
  };

  //  - - - - - - - - -CREATE WATER- - - - - - - - - 

  //  - - - - - - - - -DELETE WATER- - - - - - - - - 

  export const deleteWater = async (userId, id) => {
    return await Water.findOneAndDelete({
      _id: id,
      userId: userId,
    });
  };

  //  - - - - - - - - -DELETE WATER- - - - - - - - - 

  //  - - - - - - - - -UPDATE WATER- - - - - - - - - 
  export const updateWater = async (userId, id, amount, date) => {
    const mutableElement = await Water.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId),
    });
  
    if (!mutableElement) {
      return null;
    }
  
    let newDate;
    if (date) {
      newDate = new Date(date);
    }
  
    const updateFields = {
      date: newDate ? newDate : mutableElement.date,
      amount: amount !== undefined ? amount : mutableElement.amount,
    };
  
    return await Water.findByIdAndUpdate(
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
  
    const waterData = await Water.find({
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
  
    const waterData = await Water.find({
      userId: userId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });
  
    return waterData;
  };
  
    //  - - - - - - - - -MONTHLY WATER- - - - - - - - -