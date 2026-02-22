import {describe, test} from 'node:test';
import assert from 'node:assert';
import { dummy, totalLikes, mostFavourite, mostBlogs } from '../utils/list_helper.js';
import { blogs } from '../mockData.js';

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs);
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('is correct with many blogs', () => {
    assert.strictEqual(totalLikes(blogs), 36);
  })
})

test('most favourite works', () => {
  assert.deepStrictEqual( mostFavourite(blogs), blogs[2]);
})

test('most blogs works', () => {
  assert.deepStrictEqual(mostBlogs(blogs), {
  author: "Robert C. Martin",
  blogs: 3
})
})