import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';


// Define the interface for the document
interface IUser extends Document {
  username: string;
  roles: string[];
  password: string;
}

// Create the Mongoose schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true }, 
  password: { type: String, required: true },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role', required: true }], 
});
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    console.log('userSchema',hash)
    this.password = hash;
  }
  next();
});
// Create the Mongoose model
const UserModel = model<IUser>('User', userSchema);

export default UserModel;
