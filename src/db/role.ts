import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
}

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [String],
  // permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
  // permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission', required: true }], 
});
 
export default mongoose.model<IRole>('Role', RoleSchema);