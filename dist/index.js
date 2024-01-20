"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./router/index"));
const mongoose_1 = __importDefault(require("mongoose"));
const uri = 'mongodb://localhost:27017/practice';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const options = {};
// Apply middleware globally
app.use(express_1.default.json());
// Use the sample route
app.use('/api', index_1.default);
app.use('/create', index_1.default);
console.log(1);
console.log(1);
mongoose_1.default.connect(uri, options);
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
