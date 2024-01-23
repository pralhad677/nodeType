"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const index_1 = __importDefault(require("../db/index"));
const role_1 = __importDefault(require("../db/role"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const defaultRole = await role_1.default.findOne({ name: role || 'user' });
        const existingDocument = await index_1.default.countDocuments();
        console.log('existingDocument', existingDocument);
        if (existingDocument > 0) {
            const allData = await index_1.default.find();
            for (let document of allData) {
                const user = await index_1.default.findById(document._id).populate('roles');
                let AdminArray = user?.roles.filter(role => role.name === 'admin');
                console.log('adminArray', AdminArray);
                if (AdminArray.length === 1) {
                    if (role === undefined) {
                        console.log('not admin');
                    }
                    else {
                        res.status(403).json({ error: "Two admin is not possible" });
                        return;
                    }
                }
            }
        }
        console.log('defaultRole', defaultRole);
        if (!defaultRole) {
            return res.status(500).json({ error: 'Default role not found.' });
        }
        console.log(password);
        // Check if the user already exists
        const existingUser = await index_1.default.findOne({ username }).populate('roles');
        // const user = await UserModel.findById(document._id).populate('roles'); 
        // if(existingUser1?.roles.includes({name:'admin'}))
        // console.log('existingUSer',(existingUser?.roles[0] as any).name ==="admin")
        if (existingUser?.roles[0]?.name === "admin") {
            return res.status(400).json({ error: 'User can not have same name as Admin, try another' });
        }
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = await index_1.default.create({
            username,
            password: hashedPassword,
            roles: [defaultRole._id]
        });
        console.log('signup', newUser);
        const user = await index_1.default.findById(newUser._id).populate('roles');
        // const user1 = await UserModel.findById(newUser._id).populate('roles').populate('permissions');
        console.log(user);
        console.log((user?.roles[0]).name === "admin");
        // console.log(user1)
        return res.status(201).json((user?.roles[0]).name === "admin" ? { message: 'admin registered successfully', user: newUser } : { message: 'User registered successfully', user: newUser });
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
        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }
        const passwordMatch = bcrypt_1.default.compare(password, user.password); // add await 
        console.log('passwordMatch', passwordMatch);
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
