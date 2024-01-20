// src/app.ts
import express from 'express';
// import sampleRoute from './router/index.js';
import sampleRoute from './router/index';

const app = express();
const PORT = process.env.PORT || 3001;

// Apply middleware globally
app.use(express.json());

// Use the sample route
app.use('/api', sampleRoute); 
console.log(1)
console.log(1)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 