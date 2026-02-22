import mongoose, { Schema } from 'mongoose';

const blogSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Blog', blogSchema)