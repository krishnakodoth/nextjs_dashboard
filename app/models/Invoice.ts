import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  date: string;
}

const InvoiceSchema = new Schema<IInvoice>({
  customer_id: { type: String, required: true, ref: 'Customer' }, // assuming `Customer` has `id` as UUID
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed'], required: true },
  date: { type: String, required: true },
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
