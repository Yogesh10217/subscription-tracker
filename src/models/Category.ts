import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  description?: string;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    color: {
      type: String,
      default: '#8083ff',
    },
    icon: {
      type: String,
      default: 'tag',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
