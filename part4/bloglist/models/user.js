import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minLength: 3,
    required: true
  },
  name: String,
  blogs: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.password
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('User', userSchema);