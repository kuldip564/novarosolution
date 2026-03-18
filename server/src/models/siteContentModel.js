import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    content: { type: Object, required: true },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'updatedAt' },
    bufferCommands: false,
  },
);

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);

export async function getSiteContentRow() {
  const row = await SiteContent.findOne({ key: 'default' }).lean();
  return row || null;
}

export async function upsertSiteContent(content) {
  await SiteContent.findOneAndUpdate(
    { key: 'default' },
    { key: 'default', content },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
}

