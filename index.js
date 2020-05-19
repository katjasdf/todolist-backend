const express = require('express')
const app = express()
require('dotenv').config()
const Todo = require('./models/todo')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// get request to get all todos from /api/todos endpoint and converting it to JSON
app.get('/api/todos', (request, response) => {
  Todo.find({}).then(todos => {
    response.json(todos.map(todo => todo.toJSON()))
    console.log(todos)
  })
})

// get request to get one todo item, based on id, usinf findById function to find id
// to match, if todo is found response will be converted to JSON, othewise response 
// with 404 (not found)
app.get('/api/todos/:id', (request, response, next) => {
    Todo.findById(request.params.id)
    .then(todo => {
        if (todo) {
            response.json(todo)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

// post request to create new object to database, which structure is same
// as set in mongooseSchema, if there is no content response with 400 (bad request)
// with required data, object will be saved and converted to JSON
app.post('/api/todos', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const todo = new Todo({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  todo.save().then(savedNote => {
    response.json(savedNote.toJSON())
  })
})

// delete request to remove object, with findByIdAndRemove, which looks
// for same id and when found will remove object and response with 204 (no content)
app.delete('/api/todos/:id', (request, response, next) => {
    Todo.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// put request to update one object data with findByIdAndUpdate, which looks
// for same id and when found sets updated object data for edited object
// converts data to JSON
app.put('/api/todos/:id', (request, response, next) => {
    const body = request.body

    const todo = {
        content: body.content,
        important: body.important,
    }

    Todo.findByIdAndUpdate(request.params.id, todo, { new: true })
        .then(updatedTodo => {
            response.json(updatedTodo)
        })
        .catch(error => next(error))
})

// when called returns error status and message based on error.name
// if error.name doesn't match with specifiend errors forwards error handling
// for Express error handler with next()
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

// setting port as defined in .env or as 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})