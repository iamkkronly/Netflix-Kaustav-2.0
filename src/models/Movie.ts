import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  name: string;
  image: string;
  link: string[];
}

const MovieSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Movie || mongoose.model<IMovie>('Movie', MovieSchema);