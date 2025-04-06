import mongoose, { Schema, Document } from 'mongoose';

export interface IRevenue extends Document {
    month: string;
    revenue: number;
}

const RevenueSchema = new Schema<IRevenue>({
    month: { type: String, required: true },
    revenue: { type: Number, required: true },
}, {
    timestamps: true // <-- This adds createdAt and updatedAt fields automatically
});

export default mongoose.models.Revenue || mongoose.model<IRevenue>('Revenue', RevenueSchema);
