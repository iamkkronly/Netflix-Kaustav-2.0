import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  telegramSession?: string;
}

const UserSchema: Schema = new Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
  },
  telegramSession: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);