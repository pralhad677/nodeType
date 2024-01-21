import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string;
}

const PermissionSchema = new Schema({
  name: String,
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);