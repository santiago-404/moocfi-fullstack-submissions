import { Fragment } from "react/jsx-runtime";

const Persons = ({list, handleDelete}) => {
  return (
    <div>
      {list.map(element => 
        <Person key={element.id} props={element} handleDelete={handleDelete} id={element.id}/>)}
    </div>
  )
}

const Person = ({props: {name, number}, id, handleDelete}) => {  
  return (
    <Fragment>
      <li>
        {name} | {number} 
        <button onClick={handleDelete(id)}>delete</button> 
      </li>
    </Fragment>
  )
}

export default Persons;