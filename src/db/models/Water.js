import { model, Schema } from "mongoose";

const waterSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      amount: {
        type: Number,
        required: true,
        default: 0,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
});

const WaterConsumption = model('WaterConsumption', waterSchema);
export default WaterConsumption;