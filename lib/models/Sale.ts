import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  customer: string;
  date: Date;
  quantity: number;
  rate: number;
  amount: number;
  paymentReceived: number;
  pendingAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new Schema<ISale>(
  {
    customer: {
      type: String,
      required: [true, 'Please provide customer name'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide sale date'],
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
    paymentReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate pending amount before save
// Use synchronous pre hook without `next` to avoid middleware signature issues
saleSchema.pre<ISale>('save', function () {
  this.pendingAmount = this.amount - this.paymentReceived;
});

export default mongoose.models.Sale || mongoose.model<ISale>('Sale', saleSchema);
