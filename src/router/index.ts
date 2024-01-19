// src/routes/sampleRoute.ts
import express from 'express'; 

import sampleController from '../controller/index'
import sampleMiddleware  from '../middleware/index';

const router = express.Router();

router.get('/sample', sampleMiddleware, sampleController.getSampleData);

export default router;
