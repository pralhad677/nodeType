"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sampleMiddleware = (req, res, next) => {
    console.log('Sample Middleware executed');
    next();
};
exports.default = sampleMiddleware;
