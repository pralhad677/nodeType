"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/sampleRoute.ts
const express_1 = __importDefault(require("express"));
const AuthControler_1 = require("../controller/AuthControler");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
// router.get('/sample', sampleMiddleware, sampleController.getSampleData);
// router.post('/user',sampleMiddleware,sampleController.createUser);
router.post('/signup', AuthControler_1.signUp);
router.post('/login', AuthControler_1.login);
router.get('/protected', authmiddleware_1.authenticate, 
// async( )=>{
// await authorize(['read', 'write']) 
(0, authmiddleware_1.authorize)(['read', 'write']), (req, res) => {
    res.json({ message: 'This route requires read and write permissions.' });
}
// }
);
exports.default = router;
