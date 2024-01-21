// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import UserModel from '../db/index';
import RoleModel from '../db/role'

export async function authorize(permissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id; // Assuming you have middleware to attach user information to the request
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    

    
    const userPermissions = await user.roles.reduce(async (accPromise, roleName) => {
        const acc = await accPromise;
        const role = await RoleModel.findOne({ name: roleName });
        if (role) {
          return [...acc, ...role.permissions];
        }
        return acc;
      }, Promise.resolve([] as string[]));
    

    const hasPermission = permissions.every((permission) => userPermissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}
