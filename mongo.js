// test file for running mongo from terminal
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-lm2d7.mongodb.net/todo-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const todoSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Todo = mongoose.model('Todo', todoSchema)

const todo = new Todo({
  content: 'Callback-functions suck',
  date: new Date(),
  important: true,
})

/*
todo.save().then(response => {
  console.log('todo saved!');
  mongoose.connection.close();
})
*/

Todo.find({}).then(result => {
  result.forEach(todo => {
    console.log(todo)
  })
  mongoose.connection.close()
})