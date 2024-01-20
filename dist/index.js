"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
// import sampleRoute from './router/index.js';
const index_1 = __importDefault(require("./router/index"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Apply middleware globally
app.use(express_1.default.json());
// Use the sample route
app.use('/api', index_1.default);
console.log(1);
console.log(1);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
