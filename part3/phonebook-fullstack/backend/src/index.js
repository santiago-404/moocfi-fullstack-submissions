import express from "express";
import morgan from "morgan";
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')))

app.use(cors());  

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ''; // Return empty string for GET, DELETE, etc.
});

// 3. Use the token in a custom format
// We added :body at the end so it shows the POST data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/info', (req, res) => {
  res.send(`
    phonebook has info for ${phonebook.length} people <br>
    ${new Date()}
  `);
})

app.get('/api/phonebook', (req, res) => {
  res.json(phonebook);
})

app.get('/api/phonebook/:id', (req, res) => {
  const id = req.params.id;
  const findEntry = phonebook.find(p => p.id === id);

  if(findEntry === undefined){
    res.sendStatus(404);
  }

  res.json(findEntry);
})

app.post('/api/phonebook', (req, res) => {
  const {name, number} = req.body;
  
  const nameExists = (name) => {
    const result = phonebook.find(p => p.name === name)
    return result;
  }

  if(!name) return res.status(400).send({error: 'must include name'});
  if(!number) return res.status(400).send({error: 'must include number'});
  if(nameExists(name)) return res.status(400).send({error: 'name must be unique'});

  const newEntry = {
    id: Math.random() * (1000 - 10) + 10,
    name: name,
    number: number
  }

  phonebook.push(newEntry);
  res.status(200).json(newEntry);
})

app.delete('/api/phonebook/:id', (req, res) => {
  const id = Number(req.params.id);
  const findEntry = phonebook.find(p => p.id === id);

  if(findEntry === undefined){
    return res.sendStatus(204);
  }

  phonebook = phonebook.filter(p => p.id !== id);
  return res.sendStatus(204);
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
})