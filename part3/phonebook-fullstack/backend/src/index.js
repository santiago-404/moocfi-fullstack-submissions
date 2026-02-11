import { loadEnvFile } from 'node:process'
loadEnvFile()
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import Entry from '../mongodb.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(_result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.json())

morgan.token('body', (req, _res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return '' // Return empty string for GET, DELETE, etc.
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', async (req, res) => {
  const entries = await Entry.find({})
  res.send(`
    phonebook has info for ${entries.length} people <br>
    ${new Date()}
  `)
})

app.get('/api/phonebook', async (req, res) => {
  const entries = await Entry.find({})
  return res.status(200).json(entries)
})

app.get('/api/phonebook/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const findEntry = await Entry.findById(id)

    if(findEntry === null){
      return res.sendStatus(404)
    }

    return res.status(200).json(findEntry)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
})

app.post('/api/phonebook', async (req, res) => {
  const { name, number } = req.body

  const nameExists = (name) => Entry.findOne({ name })

  if(!name) return res.status(400).send({ error: { message: 'must include name' } })
  if(!number) return res.status(400).send({ error: { message: 'must include number' } })
  if(await nameExists(name)) return res.status(400).send({ error: { message: 'name must be unique' } })

  const entry = {
    name: name,
    number: number
  }

  const newEntry = await Entry.create(entry)

  return res.status(200).json(newEntry)
})

app.patch('/api/phonebook/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const { body } = req
    let findEntry = await Entry.findById(id)
    console.log(findEntry)

    findEntry.set(body)
    console.log(findEntry, 676767)

    await findEntry.save()
    return res.status(200).json(findEntry)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/phonebook/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const findEntry = await Entry.findById(id)

    if(findEntry === null){
      return res.sendStatus(204)
    }

    await findEntry.deleteOne()
    return res.sendStatus(204)
  } catch (error) {
    console.log(error.message)
    next(error)
  }
})


app.use((req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`)
  err.status = 404
  next(err)
})

//really useful error handler middleware :>>
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      status: statusCode,
      // Debugging clues
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      // Only show stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : 'REDACTED'
    }
  })
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})