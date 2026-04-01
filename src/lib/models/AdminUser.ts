import mongoose, { Schema, type Document } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  passwordHash: string;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.AdminUser as mongoose.Model<IAdminUser> ||
  mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
