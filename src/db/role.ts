import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
}

const RoleSchema = new Schema({
  name: String,
  permissions: [String],
});

export default mongoose.model<IRole>('Role', RoleSchema);