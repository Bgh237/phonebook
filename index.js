const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :res[content-length] ":referrer" :response-time ms :body'))

app.use(express.json())
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
          "name": "Test",
          "number": "54",
          "id":5
      }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId +1
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    let names = persons.map(person => person.name)
    
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if(names.includes(body.name)) {
        return response.status(400).json({
            error: 'Name already exists in phonebook'
        })
    }      
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {
    response.send(
        `<div> 
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>`
    )
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})