

import { addWater, dailyWater, deleteWater, monthlyWater, updateWater } from "../services/water.js";

//  - - - - - - - - -CREATE WATER- - - - - - - - - 

export const addWaterController = async (req, res) => {
    const { date, amount } = req.body;
    const userId = req.user.id;
  
    try {
      if (!amount) {
        return res.status(400).json({ message: 'Amount is required!' });
      }

      let currentDate;
      if (!date) {
        currentDate = new Date();
      } else {
        currentDate = new Date(date);
        if (isNaN(currentDate.getTime())) {
          return res.status(400).json({ message: 'Invalid date format!' });
        }
      }
  
      const water = await addWater(userId, currentDate, amount);
  
      res.status(201).json({
        status: 201,
        message: 'Successfully added water consumption!',
        data: water,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
//  - - - - - - - - -CREATE WATER- - - - - - - - - 

//  - - - - - - - - -DELETE WATER- - - - - - - - - 

  export const deleteWaterController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      const deletedWater = await deleteWater(userId, id);
  
      if (!deletedWater) {
        return res.status(404).json({ message: `Entry with ${id} not found` });
      }
  
      res.status(204).json({
        status: 204,
        message: 'Successfully deleted water consumption!',
        data: {id: id},
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
//  - - - - - - - - -DELETE WATER- - - - - - - - - 

//  - - - - - - - - -UPDATE WATER- - - - - - - - - 

  export const updateWaterController = async (req, res) => {
    const { id } = req.params;
    const { date, amount } = req.body;
    const userId = req.user._id;
  
    try {
      const updatedWater = await updateWater(userId, id, amount, date);
  
      if (!updatedWater) {
        return res.status(404).json({ message: 'Entry not found' });
      }
  
      res.status(200).json({
        status: 200,
        message: 'Successfully updated amount of water!',
        data: updatedWater,
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

//  - - - - - - - - -UPDATE WATER- - - - - - - - - 

//  - - - - - - - - -DAILY WATER- - - - - - - - -

export const dailyWaterController = async (req, res) => {
    const userId = req.user.id;
    const {date } = req.body;
    console.log(req);
  
    try {
      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }
  
      const waterData = await dailyWater(userId, date);
  
      res.status(200).json({
        status: 200,
        message: 'Successfully retrieved daily water consumption!',
        data: waterData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //  - - - - - - - - -DAILY WATER- - - - - - - - -

  //  - - - - - - - - -MONTHLY WATER- - - - - - - - -

  export const monthlyWaterController = async (req, res) => {
    const userId = req.user.id;
    const { date } = req.body;
  
    try {
      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }
  
      const waterData = await monthlyWater(userId, date);
  
      res.status(200).json({
        status: 200,
        message: 'Successfully retrieved monthly water consumption!',
        data: waterData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

    //  - - - - - - - - -MONTHLY WATER- - - - - - - - -

