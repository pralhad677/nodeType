"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/sampleRoute.ts
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../controller/index"));
const index_2 = __importDefault(require("../middleware/index"));
const router = express_1.default.Router();
router.get('/sample', index_2.default, index_1.default.getSampleData);
router.post('/user', index_2.default, index_1.default.createUser);
exports.default = router;
