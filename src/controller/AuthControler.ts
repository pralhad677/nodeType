import { Request, Response } from 'express';
import UserModel from '../db/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

 
export const signUp =async(req:Request,res: Response) =>{
    try {
        const { username, password, roles } = req.body;
        console.log(password)
    
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ username });
    
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = await UserModel.create({
          username,
          password: hashedPassword,
          roles,
        });
    console.log('signup',newUser)
        return res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
    
        // Find the user by username
        const user = await UserModel.findOne({ username });
        console.log(username,password);
        console.log(user)
        if (!user) {
          return res.status(401).json({ error: 'Invalid username' });
        }
     
       console.log(password)
        const passwordMatch =  await bcrypt.compare(password,user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid password' });
        }
    
        // Generate a JWT token for authentication
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
     
        return res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}

 