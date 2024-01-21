"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const index_1 = __importDefault(require("../db/index"));
const role_1 = __importDefault(require("../db/role"));
async function authorize(permissions) {
    return async (req, res, next) => {
        const userId = req.user.id; // Assuming you have middleware to attach user information to the request
        const user = await index_1.default.findById(userId);
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
    };
}
exports.authorize = authorize;
