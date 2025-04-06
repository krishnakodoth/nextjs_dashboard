// models/Customer.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  id: string;
  name: string;
  email: string;
  image_url: string;
}

const CustomerSchema = new Schema<ICustomer>({
  id: { type: String, required: true, unique: true }, // UUID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image_url: { type: String, required: true },
});

// Prevent model overwrite issues in dev environments
export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
