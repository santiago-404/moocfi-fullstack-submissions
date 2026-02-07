import {useState, useEffect} from 'react'
import axios from 'axios';
import { getAll, postEntry, deleteEntry, patchEntry} from './services/requests';
import Persons from './components/PersonsList';
import Filter from './components/SearchFilter';
import PersonForm from './components/PersonForm';
import { Notification } from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: ''
  });  

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAll();
  
      setPersons(response);
    }
    fetchData();
  }, [])

  const handleNameChange = event => setNewName(event.target.value);
  const handleNumChange = event => setNewNum(event.target.value);
  const handleFilter = event => setFilter(event.target.value);

  const handleDelete = (id) => {
    return async () => {
      const person = persons.find(p => p.id === id);
      const userAnswer = window.confirm(`Delete ${person.name} ?`)
      if(userAnswer){
        try {
          const result = await deleteEntry(id);
          const newList = persons.filter(person => person.id !== id);
          setPersons(newList);
        } catch (error) {
          console.log(error.response.data);
          setNotification({
            sucess: true,
            message: error.response.data
          });
          const newList = persons.filter(person => person.id !== id);
          setPersons(newList);
          
          setTimeout(() => setNotification({...notification, message: ''}), 3000);
        }
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = persons.find(person => person.name === newName || person.number === newNum);

    if(result){
      const userAnswer = window.confirm(`${newName}'s name/number is already added to phonebook, replace the old number with the new one?`);
      if(userAnswer){
        const response = await patchEntry(result.id, {number: newNum});
        setPersons(persons.map(p => p.id === result.id ? response : p));
      }
    }else{
      const newEntry = await postEntry({name: newName, number: newNum});
      setPersons(persons.concat(newEntry));
    }

    setNotification({
      success: true,
      message: `${newName} is added to the phonebook`
    });

    
    setTimeout(() => setNotification({
      success: false,
      message: ''
    }), 3000);

    setNewName('');
    setNewNum('');
  }

  const list = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter))
  

  return (
    <div>
      <h3>Phonebook</h3>
      <Notification content={notification}/>
      <Filter value={filter} onChange={handleFilter}/>

      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNum={newNum}
        handleNumChange={handleNumChange}
      />

      <h3>Numbers</h3>
      <Persons list={list} handleDelete={handleDelete}/>
    </div>
  )
}






export default App