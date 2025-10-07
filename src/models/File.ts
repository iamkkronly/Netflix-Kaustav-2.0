import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  fileName: string;
  folderPath: string; // e.g., "/documents/work/"
  messageId: number;
  size: number; // in bytes
  mimeType: string;
  isShared: boolean;
  shareToken?: string;
  sharePassword?: string;
  shareExpiresAt?: Date;
}

const FileSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  folderPath: {
    type: String,
    required: true,
    trim: true,
    default: '/',
    index: true,
  },
  messageId: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  isShared: {
    type: Boolean,
    default: false,
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  sharePassword: {
    type: String,
  },
  shareExpiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index for ensuring unique file names within a folder for a user
FileSchema.index({ userId: 1, folderPath: 1, fileName: 1 }, { unique: true });

export default mongoose.models.File || mongoose.model<IFile>('File', FileSchema);