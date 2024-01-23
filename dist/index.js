"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./router/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const role_1 = __importDefault(require("./db/role"));
const dotenv = __importStar(require("dotenv"));
const permission_1 = __importDefault(require("./db/permission"));
const authmiddleware_1 = require("./middleware/authmiddleware");
const uri = 'mongodb://localhost:27017/practice';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const options = {};
dotenv.config();
// require('dotenv').config({path: './configs/global.env'});
// console.log(process.env.SECRET_KEY) 
// Apply middleware globally
app.use(express_1.default.json());
// Use the sample route
// app.use('/api', sampleRoute); 
// app.use('/create',sampleRoute)
app.use('/user/auth', index_1.default);
app.use('/admin/auth', (0, authmiddleware_1.checkUserRole)('admin'), index_1.default);
// app.post('/api/write', 
// mongoose.connect(uri, options);
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(uri, {});
        const hasSeededData = await role_1.default.findOne({ name: 'admin' });
        if (hasSeededData) {
            console.log('Database already seeded. Skipping.');
            return;
        }
        // Seed default roles
        const adminRole = await role_1.default.create({ name: 'admin', permissions: ['read', 'write', 'delete'] });
        const userRole = await role_1.default.create({ name: 'user', permissions: ['read', 'write'] });
        // Seed default permissions
        await permission_1.default.create({ name: 'read' });
        await permission_1.default.create({ name: 'write' });
        await permission_1.default.create({ name: 'delete' });
        console.log('Database seeded successfully');
    }
    catch (error) {
        console.error('Error during database seeding:', error);
    }
    finally {
        // mongoose.disconnect();
    }
}
seedDatabase();
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
