// src/routes/sampleRoute.ts
import express from 'express'; 

import sampleController from '../controller/index'
import sampleMiddleware  from '../middleware/index';
import { login, signUp } from '../controller/AuthControler';

import { authenticate, authorize } from '../middleware/authmiddleware';

const router = express.Router();

// router.get('/sample', sampleMiddleware, sampleController.getSampleData);
// router.post('/user',sampleMiddleware,sampleController.createUser);
router.post('/signup', signUp);
router.post('/login', login); 
router.get('/protected',   authenticate,
// async( )=>{
 
// await authorize(['read', 'write']) 
  authorize(['read','write'])
 , (req: any, res: { json: (arg0: { message: string; }) => void; }) => {
  
    res.json({ message: 'This route requires read and write permissions.' });
}
  // }
  );

export default router;
 