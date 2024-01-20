// src/app.ts
import express from 'express'; 
import sampleRoute from './router/index'; 
import mongoose, { ConnectOptions } from 'mongoose';

const uri: string = 'mongodb://localhost:27017/practice'
const app = express();
const PORT = process.env.PORT || 3001;

const options: ConnectOptions = {
  
};



// Apply middleware globally
app.use(express.json());

// Use the sample route
app.use('/api', sampleRoute); 
app.use('/create',sampleRoute)
console.log(1)
console.log(1)
mongoose.connect(uri, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 