import { Schema, model, models, type Document } from 'mongoose';

export interface IZellePayment extends Document {
  name: string;
  phone: string;
  reference: string;
  imageUrl?: string;
  courseName: string;
  amount: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: Date;
  verifiedAt?: Date;
  notes?: string;
}

const ZellePaymentSchema = new Schema<IZellePayment>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  reference: { type: String, required: true },
  imageUrl: { type: String },
  courseName: { type: String, required: true },
  amount: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  notes: { type: String }
});

const ZellePaymentModel = models.ZellePayment || model<IZellePayment>('ZellePayment', ZellePaymentSchema);

export default ZellePaymentModel;