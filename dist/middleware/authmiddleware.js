"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = exports.authenticate = exports.authorize = void 0;
const index_1 = __importDefault(require("../db/index"));
const role_1 = __importDefault(require("../db/role"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authorize(permissions) {
    console.log('authorize');
    return async (req, res, next) => {
        try {
            console.log('inner');
            const userId = req.user.userId; // Assuming you have middleware to attach user information to the request
            console.log('userId :', userId);
            // console.log(typeof userId)
            // console.log(userId)
            // console.log(userId ==='65acf568aa819127f065b29a')
            // let id = new mongoose.Types.ObjectId('65acf568aa819127f065b29a');
            // console.log('id',id)
            const user = await index_1.default.findById(userId);
            console.log('user', user);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            let rolesOfUser = await index_1.default.findById(user._id).populate('roles');
            console.log('rolesOfUser', rolesOfUser);
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
                const role = await role_1.default.findOne({ name: roleName.name });
                console.log('role', role);
                if (role) {
                    return [...acc, ...role.permissions];
                }
                return acc;
            }, Promise.resolve([]));
            console.log('userPermission', userPermissions);
            const hasPermission = permissions.every((permission) => userPermissions?.includes(permission));
            console.log('hasPermission', hasPermission);
            if (!hasPermission) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            else if (userPermissions?.includes("delete")) {
                return res.status(200).json({ message: "admin:you are allowed" });
            }
            return res.status(200).json({ message: "user:you are allowed" });
            next();
        }
        catch (error) {
            console.log('error:', error);
        }
    };
}
exports.authorize = authorize;
// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   // Perform your authentication logic, e.g., checking tokens or session
//   // After successful authentication, attach user information to the request
//   (req as any).user = { id: req.query.id}; // Replace this with your actual user object
//   console.log('abc',(req as any).user.id)
//   next();
// }
const authenticate = async (req, res, next) => {
    // console.log(req.headers.authorization)
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token', token);
    if (token === undefined) {
        return res.status(401).json({ error: 'Unauthorized!token invalid' });
    }
    try {
        const secretKey = process.env.SECRET_KEY || 'ypur secret ket';
        console.log('secretKey', secretKey);
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        console.log('decoded', decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log('error', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.authenticate = authenticate;
const checkUserRole = (requiredRole) => {
    return (req, res, next) => {
        // Assuming that user information is stored in req.user after authentication
        console.log('checkUser', req.user);
        if (req.user && req.user.roles.includes(requiredRole)) {
            next();
        }
        else {
            res.status(403).json({ message: 'Forbidden' });
        }
    };
};
exports.checkUserRole = checkUserRole;
