import express from 'express'
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const usersRouter = express.Router();

usersRouter.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const findUser = await User.findOne({username});
  if(!findUser) return res.status(401).json({error: 'invalid credentials'});

  const samePassword = await bcrypt.compare(password, findUser.password);
  if(!samePassword) return res.status(401).json({error: 'invalid credentials'});

  const userData = {
    username,
    id: findUser._id
  }

  const token = jwt.sign(userData, process.env.JWT_SECRET);
  
  res.status(200).json({
    token, 
    username: findUser.username,
    name: findUser.name
  });
})

usersRouter.post('/', async (req, res) => {
  const {username, password, name} = req.body;
  if(!username || !password) return res.status(400).json({error: 'missing credentials'});
  if(username.length < 3 || password.length < 3) return res.status(400).json({error: 'username and password must be atleast 3 characters long'});

  const findUser = await User.findOne({username});
  if(findUser) return res.status(401).send({error: 'username already taken'});

  const newUser = {
    username,
    name,
    password: bcrypt.hashSync(password, 10)
  }

  const result = await User.create(newUser);
  res.status(201).json(result);
})

usersRouter.get('/', async (req, res) => {
  const allUsers = await User.find({}).populate('blogs');
  res.status(200).json(allUsers);
})

export default usersRouter;