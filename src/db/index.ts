import { Schema, model, Document } from 'mongoose';

// Define the interface for the document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

// Create the Mongoose schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the Mongoose model
const UserModel = model<IUser>('User', userSchema);

export default UserModel;
