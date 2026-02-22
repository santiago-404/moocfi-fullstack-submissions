import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import Blog from "../models/blog.js";
import {test, after, describe, beforeEach} from 'node:test';
import assert from "node:assert";
import 'dotenv/config'
import jwt from 'jsonwebtoken';
import User from '../models/user.js'
import bcrypt from "bcryptjs";

const api = supertest(app);

let initialBlogs;
let token;

describe('Blog API', { concurrency: false }, () => {
  beforeEach(async () => {

    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', password: passwordHash })
    const savedUser = await user.save()

    // 2. Generate a token for this user
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }

    token = jwt.sign(userForToken, process.env.JWT_SECRET);

    const result = await Blog.insertMany([{
      title: "React patterns",
      user: savedUser._id,
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      user: savedUser._id,
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    }])

    initialBlogs = result
  })



  describe('GET request', () => {
    test('returns the right amount of blogs in JSON format', async () => {
      const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /json/)

      assert.equal(initialBlogs.length, blogs.body.length);
    })

    test('returns the documents with <id> instead of <_id>', async () => {
      const blogs = await api.get('/api/blogs');
      const keys = Object.keys(blogs.body[0]);
      assert(keys.includes('id'))
    })
  })

  describe('POST request', { concurrency: false }, () => {
    test('successfuly creates a new entry on the database', async () => {
      const newEntry = {
        title: 'the rizzoning',
        author: "Edsger W. Dijstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newEntry)
        .expect('Content-Type', /json/)
        .expect(201);

      const blogs = await api.get('/api/blogs');
      const titles = blogs.body.map(b => b.titl);
      assert(titles.includes(newEntry.title))
      assert.equal(blogs.body.length, initialBlogs.length + 1);
    })

    test('likes filed is defaulted to value 0 when ommited', async () => {
      const newEntry = {
        title: 'the rizzoning',
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      }

      const newBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newEntry)
        .expect('Content-Type', /json/)
        .expect(201);

      assert.equal(newBlog.body.likes, 0);  
    })

    test('with missing title or url fields are responded with 400', async () => {
      const newEntry = {
        title: 'the rizzoning',
        author: "Edsger W. Dijkstra",
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newEntry)
        .expect('Content-Type', /json/)
        .expect(400);
    })
  })

  test.only('DELETE works', async () => {
    const result = await api.get('/api/blogs');
    const blog = result.body[0];
    console.log(result.body);
    console.log('id', blog.id);

    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogs = await api.get('/api/blogs');
    console.log('initial', initialBlogs);
    console.log('actual', blogs.body);
    assert.equal(blogs.body.length, initialBlogs.length - 1);
  })

  test('PATCH like works', async () => {
    const result = await api.get('/api/blogs');
    const blog = result.body[0];

    const updatedBlog = await api
      .patch(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({likes: 100})
      .expect(201)
      .expect('Content-Type', /json/)

    assert.equal(updatedBlog.body.likes, 100);
  })

  after( async () => {
    await mongoose.connection.close()
  })
})