import mongoose, { Schema, type Document } from 'mongoose';

export interface ISiteContent extends Document {
  navigation: { logoPath: string };
  hero: { title: string; description: string; communityLabel: string; backgroundImage: string; communityStats: string; floatingCardTitle: string; floatingCardSubtitle: string };
  pricing: { amount: string; intervalLabel: string; ctaLabel: string; ctaHref: string; helperText: string; sectionHeading: string };
  schedule: { eyebrow: string; title: string; description: string; galleryTitle: string; galleryDescription: string };
  modal: { ctaLabel: string; ctaHref: string };
  footer: { highlightItems: string[]; copyrightText: string };
  contact: { phone: string; location: string; email: string; emailHref: string };
  books: Array<{ month: string; title: string; author: string; meetings: string; time: string; imageKey: string; isCompleted: boolean }>;
  updatedAt: Date;
}

const BookSchema = new Schema({
  month: String,
  title: String,
  author: { type: String, default: '' },
  meetings: String,
  time: String,
  imageKey: String,
  isCompleted: { type: Boolean, default: false },
}, { _id: false });

const SiteContentSchema = new Schema<ISiteContent>({
  navigation: {
    logoPath: String,
  },
  hero: {
    title: String,
    description: String,
    communityLabel: String,
    backgroundImage: String,
    communityStats: String,
    floatingCardTitle: String,
    floatingCardSubtitle: String,
  },
  pricing: {
    amount: String,
    intervalLabel: String,
    ctaLabel: String,
    ctaHref: String,
    helperText: String,
    sectionHeading: String,
  },
  schedule: {
    eyebrow: String,
    title: String,
    description: String,
    galleryTitle: String,
    galleryDescription: String,
  },
  modal: {
    ctaLabel: String,
    ctaHref: String,
  },
  footer: {
    highlightItems: [String],
    copyrightText: String,
  },
  contact: {
    phone: String,
    location: String,
    email: String,
    emailHref: String,
  },
  books: [BookSchema],
}, { timestamps: true });

export default mongoose.models.SiteContent as mongoose.Model<ISiteContent> ||
  mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
