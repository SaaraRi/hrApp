
import './App.css'
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router";
import Root from './pages/Root';
import About from './pages/About';
import PersonsList from './components/PersonsList/PersonsList';
import AddEmployeeForm from './pages/AddEmployeeForm';
import ErrorPage from './pages/ErrorPage';
import { persons } from './data/personsData';

const App = () => {

  const [personsData, setPersonsData] = useState(persons);

  const addEmployeeHandler = (newEmployee) => {
    setPersonsData((prev) => [
      ...prev,
      { ...newEmployee, id: Date.now()}
    ]);  
  };

  return (

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Root />}>
      <Route path="/about" element={<About />} />
      <Route
        path="/list"
        index element={
          <PersonsList
            personsData={personsData}
          />
        }
      />
      <Route
        path="/add"
        element={<AddEmployeeForm onAddEmployee={addEmployeeHandler} />}
      />
      <Route
      path="/*"
      element={<ErrorPage />}
      />
    </Route>    
  </Routes>
</BrowserRouter>
);

};
export default App;
