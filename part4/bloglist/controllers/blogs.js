import express from 'express';
import Blog from '../models/blog.js';
import User from '../models/user.js';
import { checkAuth } from '../middlewares/jwt_auth.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.status(200).json(blogs);
})

blogsRouter.post('/', checkAuth, async (req, res) => {
  const {title, author, likes, url} = req.body;
  if(!title || !author || !url){
    res.status(400).json({
      error: 'missing required fields'
    })
  }

  const blog = new Blog({
    user: req.user._id,
    title,
    author,
    url,
    likes: likes ? likes : 0
  })

  await blog.save();

  req.user.blogs.push(blog._id);
  await req.user.save();

  res.status(201).json(blog)
})


blogsRouter.patch('/:id', checkAuth, async (req, res) => {
  const {likes} = req.body
  const blog = await Blog.findOne({_id: req.params.id});
  console.log(blog);
  
  blog.likes = likes;
  await blog.save();
  res.status(201).json(blog);
})

blogsRouter.delete('/:id', checkAuth, async (req, res) => {  
  let blog = await Blog.findOne({_id: req.params.id});
  console.log("user", req.user);
  
  if(req.user._id.toString() !== blog.user.toString()) return res.sendStatus(401);
  await Blog.deleteOne({_id: req.params.id, user: req.user});

  req.user.blogs = req.user.blogs.filter(b => b.toString() !== req.params.id);
  await req.user.save();

  res.sendStatus(204);
})

export default blogsRouter;