import mongoose, { Schema, type Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  eventId: string;
  timestamp: Date;
  type: 'page_view' | 'cta_click';
  route: string;
  visitorId: string;
  referrer: string;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventId: { type: String, required: true, unique: true, index: true },
  timestamp: { type: Date, required: true, index: true },
  type: { type: String, enum: ['page_view', 'cta_click'], required: true },
  route: { type: String, required: true },
  visitorId: { type: String, required: true },
  referrer: { type: String, default: 'direct' },
});

export default mongoose.models.AnalyticsEvent as mongoose.Model<IAnalyticsEvent> ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
