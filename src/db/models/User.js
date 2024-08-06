import { model, Schema } from 'mongoose';

const userSchema = new Schema(
    {
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        name: {
          type: String,
          default: "User",
        },
        gender: {
          type: String,
          enum: ['male', 'female'],
          default: "female",
        },
        weight: {
          type: Number,
          default: 0,
        },
        dailyTimeActivity: {
          type: Number,
          default: 0,
        },
        dailyNorma: {
          type: Number,
          default: 1.5,
        },
        avatar: {
          type: String,
          default: 'https://console.cloudinary.com/console/c-60c0f1e47a419ccf36eae30da18427/media_library/search?sortDirection=desc&sortField=_score&search_id=my_uploads&view_mode=mosaic&q='
        },
         },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
