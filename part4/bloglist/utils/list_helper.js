export const dummy = (blogs) => {
  return 1;
}

export const totalLikes = (blogs) => {
  const likes = blogs.reduce((likesSum, blog) => {
    return likesSum + blog.likes;
  }, 0)  
  return likes;
}

export const mostFavourite = (blogs) => {
  let currentMost = blogs[0];

  blogs.forEach(blog => {
    if(blog.likes > currentMost.likes){
      currentMost = blog;
    }
  });

  return currentMost;
}

export const mostBlogs = (blogs) => {
  const list = blogs.reduce((authors, blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + 1;
    return authors;
  }, {})


  const topAuthor = Object.keys(list).reduce((a,b) => {
    return list[a] > list[b] ? a : b;
  })

  return {
    author: topAuthor,
    blogs: list[topAuthor]
  }
}



