import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  supplier: string;
  date: Date;
  quantity: number;
  rate: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    supplier: {
      type: String,
      required: [true, 'Please provide supplier name'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide purchase date'],
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: 0,
    },
    rate: {
      type: Number,
      required: [true, 'Please provide rate'],
      min: 0,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', purchaseSchema);
