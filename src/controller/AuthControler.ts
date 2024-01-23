import { Request, Response } from 'express';
import UserModel from '../db/index';
import RoleModel from '../db/role'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

 
export const signUp =async(req:Request,res: Response) =>{
    try {
        const { username, password, role } = req.body;
        const defaultRole = await RoleModel.findOne({ name: role || 'user' });
        const existingDocument = await UserModel.countDocuments( );
        console.log('existingDocument',existingDocument)
        if(existingDocument > 0){
          const allData = await UserModel.find();
        
          for(let document of allData){ 
            const user = await UserModel.findById(document._id).populate('roles'); 
            let AdminArray:string[] = user?.roles.filter(role=>(role as any).name === 'admin') as string[]
    console.log('adminArray',AdminArray)
            if(AdminArray.length === 1){
              if(role === undefined){
                  console.log('not admin')
              }else{

                res.status(403).json({error:"Two admin is not possible"})
                return 
              }
            } 
          } 
        }
        console.log('defaultRole',defaultRole)
        if (!defaultRole) {
          return res.status(500).json({ error: 'Default role not found.' });
        }
        console.log(password)
    
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ username }).populate('roles');
        // const user = await UserModel.findById(document._id).populate('roles'); 

         
        // if(existingUser1?.roles.includes({name:'admin'}))
        // console.log('existingUSer',(existingUser?.roles[0] as any).name ==="admin")
        if((existingUser?.roles[0] as any)?.name ==="admin"){

          return res.status(400).json({ error: 'User can not have same name as Admin, try another' });
        }
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = await UserModel.create({
          username, 
          password: hashedPassword,
          roles:[defaultRole._id]
        }); 
    console.log('signup',newUser)
    
    const user = await UserModel.findById(newUser._id).populate('roles');

    // const user1 = await UserModel.findById(newUser._id).populate('roles').populate('permissions');
        console.log(user)
        console.log((user?.roles[0] as any).name ==="admin")
        // console.log(user1)
        return res.status(201).json((user?.roles[0] as any).name ==="admin"?{ message: 'admin registered successfully', user: newUser }:{ message: 'User registered successfully', user: newUser });
 
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
    
        if (!user) {
          return res.status(401).json({ error: 'Invalid username' });
        }
   
        const passwordMatch =     bcrypt.compare(password,user.password); // add await 
        console.log('passwordMatch',passwordMatch)
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid password' });
        }
    
        // Generate a JWT token for authentication
        const secretKey = process.env.SECRET_KEY || 'ypur secret ket';
        console.log('secretKey',secretKey);
        const token = jwt.sign({ userId: user._id }, secretKey as string, { expiresIn: '1h' });

        // const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
     
        return res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}

 