"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = exports.authenticate = exports.authorize = void 0;
const index_1 = __importDefault(require("../db/index"));
const role_1 = __importDefault(require("../db/role"));
function authorize(permissions) {
    console.log('authorize');
    return async (req, res, next) => {
        try {
            console.log('inner');
            console.log(req.query.id);
            const userId = req.user.id; // Assuming you have middleware to attach user information to the request
            // console.log(typeof userId)
            // console.log(userId)
            // console.log(userId ==='65acf568aa819127f065b29a')
            // let id = new mongoose.Types.ObjectId('65acf568aa819127f065b29a');
            // console.log('id',id)
            const user = await index_1.default.findById(req.query.id);
            console.log('user', user);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const userPermissions = await user.roles.reduce(async (accPromise, roleName) => {
                const acc = await accPromise;
                const role = await role_1.default.findOne({ name: roleName });
                if (role) {
                    return [...acc, ...role.permissions];
                }
                return acc;
            }, Promise.resolve([]));
            const hasPermission = permissions.every((permission) => userPermissions.includes(permission));
            if (!hasPermission) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            next();
        }
        catch (error) {
            console.log('error:', error);
        }
    };
}
exports.authorize = authorize;
function authenticate(req, res, next) {
    // Perform your authentication logic, e.g., checking tokens or session
    // After successful authentication, attach user information to the request
    req.user = { id: req.query.id }; // Replace this with your actual user object
    console.log('abc', req.user.id);
    next();
}
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
