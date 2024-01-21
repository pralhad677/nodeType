"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const index_1 = __importDefault(require("../db/index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = async (req, res) => {
    try {
        const { username, password, roles } = req.body;
        console.log(password);
        // Check if the user already exists
        const existingUser = await index_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = await index_1.default.create({
            username,
            password: hashedPassword,
            roles,
        });
        console.log('signup', newUser);
        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.signUp = signUp;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find the user by username
        const user = await index_1.default.findOne({ username });
        console.log(username, password);
        console.log(user);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }
        console.log(password);
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        // Generate a JWT token for authentication
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful', token });
    }
    catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.login = login;
