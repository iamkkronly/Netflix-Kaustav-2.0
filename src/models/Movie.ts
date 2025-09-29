import mongoose, { Document, Schema } from 'mongoose';

// Define the structure for the download links
export interface IDownloadLinks {
  p480?: string;
  p720?: string;
  p1080?: string;
}

export interface IMovie extends Document {
  name: string;
  image: string;
  downloadLinks: IDownloadLinks;
}

const DownloadLinksSchema: Schema = new Schema({
  p480: { type: String },
  p720: { type: String },
  p1080: { type: String },
}, { _id: false });

const MovieSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    downloadLinks: { type: DownloadLinksSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);