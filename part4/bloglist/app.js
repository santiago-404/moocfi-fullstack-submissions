import express from 'express';
import mongoose from 'mongoose';
import blogsRouter from './controllers/blogs.js';
import usersRouter from './controllers/users.js';
import {MONGODB_URI} from './utils/config.js'
const app = express()

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(result => console.log('Connected to database'))
  .catch(error => console.log(error))

app.use(express.json());
app.use('/api/blogs' ,blogsRouter);
app.use('/api/users', usersRouter);
export default app;