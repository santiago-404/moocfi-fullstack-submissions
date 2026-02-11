import mongoose from 'mongoose'

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8, // Validation #1: Length
    required: true,
    validate: {
      // Validation #2: Custom Regex pattern
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Entry = mongoose.model('Entry', entrySchema)
export default Entry