import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import 'dotenv/config'

export const checkAuth = async (req, res, next) => {
  const auth = req.get('authorization');

  //no token, gtfo
  if(!(auth && auth.startsWith('Bearer '))){
    return res.status(401).json({error: 'invalid token'});
  }

  const token = auth.replace('Bearer ', '');

  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);  

  //no id in token, gtfo  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  if(!user) return res.status(400).json({error: 'UserId not valid'})

  req.user = user;
  next();
}