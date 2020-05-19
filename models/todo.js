const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI

console.log('connecting to', url)

// connecting to mongoDB with mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// creating Schema that specifies object structure and data value types
const todoSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

// formatting JSON data, to hide some data setting Object key as id
todoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Todo', todoSchema)