"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../db/index"));
const createUser = async (req, res) => {
    try {
        // Create a new user using the Mongoose model
        const newUser = new index_1.default({
            username: req.body.username || 'jacob',
            email: req.body.email || 'pralhadkharel@gmail.com',
            password: req.body.password || '12345678',
        });
        // Save the user to the database
        const savedUser = await newUser.save();
        // Send the saved user as a response
        res.json(savedUser);
    }
    catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
};
const getSampleData = (req, res) => {
    console.log(3);
    const data = { message: 'Sample data from the controller' };
    res.json(data);
};
exports.default = { getSampleData, createUser };
