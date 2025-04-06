// models/Customer.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ISample extends Document {
  id: string;
  name: string;
  // email: string;
  // image_url: string;
}

const SampleSchema = new Schema<ISample>({
  id: { type: String, required: true }, // UUID // unique: true
  name: { type: String, required: true },
  // name: { type: String, required: true },
  // email: { type: String, required: true, unique: true },
  // image_url: { type: String, required: true },
});

// Prevent model overwrite issues in dev environments
export default mongoose.models.Sample || mongoose.model<ISample>('Sample', SampleSchema);
