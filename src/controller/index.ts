// src/controllers/sampleController.ts
import { Request, Response } from 'express';

const getSampleData = (req: Request, res: Response) => {
    console.log(3)
  const data = { message: 'Sample data from the controller' };
  res.json(data);
};

export default { getSampleData };
