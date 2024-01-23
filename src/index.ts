// src/app.ts
import express from 'express'; 
import sampleRoute from './router/index'; 
import mongoose, { ConnectOptions } from 'mongoose';

import RoleModel from './db/role'

import PermissionModel from './db/permission'
import { checkUserRole } from './middleware/authmiddleware';
const uri: string = 'mongodb://localhost:27017/practice'
const app = express();
const PORT = process.env.PORT || 3001;

const options: ConnectOptions = {
  
};



// Apply middleware globally
app.use(express.json());
 
// Use the sample route
// app.use('/api', sampleRoute); 
// app.use('/create',sampleRoute)
app.use('/user/auth' ,sampleRoute);
app.use('/admin/auth',checkUserRole('admin'),sampleRoute)
 
 
// mongoose.connect(uri, options);



async function seedDatabase() {
  try{ 
  await mongoose.connect(uri, {
     
  });
  const hasSeededData = await RoleModel.findOne({ name: 'admin' });

  if (hasSeededData) {
    console.log('Database already seeded. Skipping.'); 
    return; 
  }


  // Seed default roles
  const adminRole = await RoleModel.create({ name: 'admin', permissions: ['read', 'write', 'delete'] });
  const userRole = await RoleModel.create({ name: 'user', permissions: ['read','write' ] });

  

  // Seed default permissions
  await PermissionModel.create({ name: 'read' });
  await PermissionModel.create({ name: 'write' }); 
  await PermissionModel.create({ name: 'delete' });

  console.log('Database seeded successfully'); 
}catch(error){
  console.error('Error during database seeding:', error);
}
finally{

  // mongoose.disconnect();
}

  
}

seedDatabase();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`);
});
 