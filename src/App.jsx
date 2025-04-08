import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Person from './components/Person';
import { persons } from './personsData';

function App() {
 

  return (
    <>
 <div>
      <Header logo="HR Manager App" />
    </div>
    <main>
      {persons.map((person) => (
          <Person 
            key={person.id}
            name={person.name}
            title={person.title}
            salary={person.salary}
            phone={person.phone}
            email={person.email}
            animal={person.animal}
          />
      ))}
    </main>
    <div>
      <Footer year={2025} />
    </div>
    </>
  )
}

export default App;
