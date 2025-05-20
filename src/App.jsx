
import './App.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router";
import Root from './pages/Root';
import About from './pages/About';
import EmployeesList from './components/EmployeesList/EmployeesList';
import AddEmployeeForm from './pages/AddEmployeeForm';
import ErrorPage from './pages/ErrorPage';

const App = () => {

  const [employeesData, setEmployeesData] = useState([]);
  

  useEffect(() => {
    axios
      .get("http://localhost:3005/employees")
      .then((res) => setEmployeesData(res.data))
      .catch((err) => console.error("Failed to fetch employees", err));
  }, []);

  const addEmployeeHandler = (newEmployee) => {
    setEmployeesData((prev) => [
      ...prev,
      { ...newEmployee, id: Date.now()}
    ]);  
  };

  const handleEditData= (id, formData) => {
    axios
      .patch(`http://localhost:3005/employees/${id}`, formData )
      .then((res) => {
        setEmployeesData((prev) =>
          prev.map((employee) => (employee.id === id ? res.data : employee))
        );
      })
      .catch((err) => {
        console.error("Failed to update data:", err);
      });
  };

  return (

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Root />}>
      <Route path="/about" element={<About />} />
      <Route
        path="/employees"
        index element={
          <EmployeesList
            employeesData={employeesData}
            onEditData={handleEditData}
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
