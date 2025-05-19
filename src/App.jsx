
import './App.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router";
import Root from './pages/Root';
import About from './pages/About';
import PersonsList from './components/PersonsList/PersonsList';
import AddEmployeeForm from './pages/AddEmployeeForm';
import ErrorPage from './pages/ErrorPage';

const App = () => {

  const [personsData, setPersonsData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3005/employees")
      .then((res) => setPersonsData(res.data))
      .catch((err) => console.error("Failed to fetch employees", err));
  }, []);

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
