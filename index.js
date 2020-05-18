const express = require('express')
const app = express()
require('dotenv').config()
const Todo = require('./models/todo')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))


app.get('/api/todos', (request, response) => {
  Todo.find({}).then(todos => {
    response.json(todos.map(todo => todo.toJSON()))
    console.log(todos)
  })
})

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

app.post('/api/todos', (request, response) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }

  const todo = new Todo({
    title: body.title,
    description: body.description,
    date: new Date(),
  })

  todo.save().then(savedNote => {
    response.json(savedNote.toJSON())
  })
})

app.delete('/api/todos/:id', (request, response, next) => {
    Todo.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/todos/:id', (request, response, next) => {
    const body = request.body

    const todo = {
        title: body.title,
        description: body.description,
    }

    Todo.findByIdAndUpdate(request.params.id, todo, { new: true })
        .then(updatedTodo => {
            response.json(updatedTodo)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})