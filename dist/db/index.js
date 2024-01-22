"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Create the Mongoose schema
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Role', required: true }],
});
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const saltRounds = 10;
        const hash = await bcrypt_1.default.hash(this.password, saltRounds);
        console.log('userSchema', hash);
        this.password = hash;
    }
    next();
});
// Create the Mongoose model
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
