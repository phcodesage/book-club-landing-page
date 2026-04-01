/**
 * Run once to seed MongoDB with existing JSON data and create the admin user.
 * Usage: npx tsx scripts/seed.ts
 *
 * Set these env vars first (or put them in .env.local):
 *   MONGODB_URI=mongodb+srv://...
 *   ADMIN_USERNAME=admin
 *   ADMIN_PASSWORD=your-secure-password
 */

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'changeme123';

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set.');
  process.exit(1);
}

async function main() {
  console.log('🔌  Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI as string);

  // Dynamic imports after connection
  const { default: SiteContentModel } = await import('../src/lib/models/SiteContent');
  const { default: AnalyticsEventModel } = await import('../src/lib/models/AnalyticsEvent');
  const { default: AdminUser } = await import('../src/lib/models/AdminUser');

  // ── Seed site content ──────────────────────────────────────────────────────
  const existing = await SiteContentModel.countDocuments();
  if (existing === 0) {
    try {
      const raw = await readFile(path.join(process.cwd(), 'data', 'site-content.json'), 'utf8');
      const content = JSON.parse(raw);
      await SiteContentModel.create(content);
      console.log('✅  Site content seeded from data/site-content.json');
    } catch {
      console.log('⚠️   No site-content.json found, skipping content seed.');
    }
  } else {
    console.log('ℹ️   Site content already exists, skipping.');
  }

  // ── Seed analytics events ──────────────────────────────────────────────────
  const analyticsCount = await AnalyticsEventModel.countDocuments();
  if (analyticsCount === 0) {
    try {
      const raw = await readFile(path.join(process.cwd(), 'runtime-data', 'analytics.json'), 'utf8');
      const { events } = JSON.parse(raw) as { events: Array<{ id: string; timestamp: string; type: string; route: string; visitorId: string; referrer: string }> };
      if (events.length > 0) {
        await AnalyticsEventModel.insertMany(
          events.map((e) => ({
            eventId: e.id,
            timestamp: new Date(e.timestamp),
            type: e.type,
            route: e.route,
            visitorId: e.visitorId,
            referrer: e.referrer,
          }))
        );
        console.log(`✅  Migrated ${events.length} analytics events.`);
      }
    } catch {
      console.log('⚠️   No analytics.json found, skipping analytics seed.');
    }
  } else {
    console.log('ℹ️   Analytics events already exist, skipping.');
  }

  // ── Create admin user ──────────────────────────────────────────────────────
  const adminExists = await AdminUser.findOne({ username: ADMIN_USERNAME.toLowerCase() });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await AdminUser.create({ username: ADMIN_USERNAME.toLowerCase(), passwordHash });
    console.log(`✅  Admin user "${ADMIN_USERNAME}" created.`);
  } else {
    console.log(`ℹ️   Admin user "${ADMIN_USERNAME}" already exists.`);
  }

  await mongoose.disconnect();
  console.log('🎉  Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
