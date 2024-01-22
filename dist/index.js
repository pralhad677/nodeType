"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./router/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const role_1 = __importDefault(require("./db/role"));
const permission_1 = __importDefault(require("./db/permission"));
const authmiddleware_1 = require("./middleware/authmiddleware");
const uri = 'mongodb://localhost:27017/practice';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const options = {};
// Apply middleware globally
app.use(express_1.default.json());
// Use the sample route
// app.use('/api', sampleRoute); 
// app.use('/create',sampleRoute)
app.use('/user/auth', index_1.default);
app.use('/admin/auth', (0, authmiddleware_1.checkUserRole)('admin'), index_1.default);
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
        const userRole = await role_1.default.create({ name: 'user', permissions: ['read'] });
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
