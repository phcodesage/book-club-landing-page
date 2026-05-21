import 'dotenv/config';
import mongoose from 'mongoose';
import SiteContentModel from '../src/lib/models/SiteContent';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set.');
  process.exit(1);
}

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI as string);

  console.log('🔍 Locating existing SiteContent document...');
  const doc = await SiteContentModel.findOne();
  if (!doc) {
    console.error('❌ No SiteContent document found in database to update.');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('Current pricing ctaHref:', doc.pricing?.ctaHref);
  console.log('Current modal ctaHref:', doc.modal?.ctaHref);

  console.log('✏️ Updating SiteContent document with new payment link...');
  doc.pricing.ctaHref = 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=f1093876-5302-11f1-a8e1-12a0879a85b1';
  doc.modal.ctaHref = 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=f1093876-5302-11f1-a8e1-12a0879a85b1';

  await doc.save();
  console.log('✅ SiteContent document updated successfully!');

  // Retrieve to double-check
  const updatedDoc = await SiteContentModel.findOne();
  console.log('Updated pricing ctaHref:', updatedDoc?.pricing?.ctaHref);
  console.log('Updated modal ctaHref:', updatedDoc?.modal?.ctaHref);

  await mongoose.disconnect();
  console.log('🎉 Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
