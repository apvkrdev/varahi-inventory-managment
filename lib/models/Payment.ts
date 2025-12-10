import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  saleId: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    saleId: {
      type: Schema.Types.ObjectId,
      ref: 'Sale',
      required: [true, 'Please provide sale ID'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide payment date'],
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
