// src/controllers/sampleController.ts
import { Request, Response } from 'express'; 
import UserModel from '../db/index';

async function createUserWithRoles(username: string, password: string, roles: string[]) {
  const newUser = await UserModel.create({ username, password, roles });
  return newUser;
}
  const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create a new user using the Mongoose model
    // const newUser = new UserModel({
    //   username: req.body.username || 'jacob',
    //   email: req.body.email || 'pralhadkharel@gmail.com', 
    //   password: req.body.password || '12345678',
    // });
    const newUser = await createUserWithRoles(req.body.username ,req.body.password,req.body.roles);

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send the saved user as a response
    res.json(savedUser);
  } catch (error:any) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};


const getSampleData = (req: Request, res: Response) => {
    console.log(3)
  const data = { message: 'Sample data from the controller' };
  res.json(data);
};

export default { getSampleData,createUser };
