// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import UserModel from '../db/index';
import RoleModel from '../db/role' 

import jwt from 'jsonwebtoken';

export   function authorize(permissions: string[]) {
  console.log('authorize')
  return async (req: Request, res: Response, next: NextFunction) => {
    try{
    console.log('inner')  
    const userId = (req as any).user.userId; // Assuming you have middleware to attach user information to the request
    console.log('userId :',userId)
    // console.log(typeof userId)
    // console.log(userId)
    // console.log(userId ==='65acf568aa819127f065b29a')
    // let id = new mongoose.Types.ObjectId('65acf568aa819127f065b29a');
    // console.log('id',id)
    const user = await UserModel.findById(userId);
    console.log('user',user)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    let rolesOfUser = await UserModel.findById(user._id).populate('roles');
    console.log('rolesOfUser',rolesOfUser)
    // console.log(user.roles.populate())
    // const userPermissions = await user.roles.reduce(async (accPromise, roleName) => {
    //     const acc = await accPromise;
    //     const role = await RoleModel.findOne({ name: roleName });
    //     if (role) {
    //       return [...acc, ...role.permissions];
    //     }
    //     return acc;
    //   }, Promise.resolve([] as string[]));
    
      const userPermissions = await rolesOfUser?.roles.reduce(async (accPromise, roleName) => {
        const acc = await accPromise;
        const role = await RoleModel.findOne({ name: (roleName as any).name });
        console.log('role',role);
        if (role) {
          return [...acc, ...role.permissions];
        }
        return acc;
      }, Promise.resolve([] as string[]));
    console.log('userPermission',userPermissions)
    const hasPermission = permissions.every((permission) => userPermissions?.includes(permission));
        console.log('hasPermission',hasPermission)
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    else if(userPermissions?.includes("delete")){

      return res.status(200).json({message:"admin:you are allowed"});
    }

    return res.status(200).json({message:"user:you are allowed"});
    next();
  }catch(error){
    console.log('error:',error)
  }
  };
}

// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   // Perform your authentication logic, e.g., checking tokens or session
//   // After successful authentication, attach user information to the request
//   (req as any).user = { id: req.query.id}; // Replace this with your actual user object
//   console.log('abc',(req as any).user.id)
//   next();
// }
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.headers.authorization)
  const token = req.headers.authorization?.split(' ')[1];
  console.log('token',token)
  if (token===undefined) {
    return res.status(401).json({ error: 'Unauthorized!token invalid' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    console.log('decoded',decoded);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
export const checkUserRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming that user information is stored in req.user after authentication
    console.log('checkUser',(req as any).user)
    if ((req as any).user && ((req as any).user as any).roles.includes(requiredRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};