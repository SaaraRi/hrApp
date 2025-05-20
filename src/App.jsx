import './App.css';
import { BrowserRouter, Route, Routes } from "react-router";
import Root from './pages/Root';
import About from './pages/About';
import EmployeesList from './components/EmployeesList/EmployeesList';
import AddEmployeeForm from './pages/AddEmployeeForm';
import ErrorPage from './pages/ErrorPage';
import useAxios from './hooks/useAxios';

const App = () => {
  const {
    employeesData,
    create,
    update,
  } = useAxios("http://localhost:3005/employees");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="/about" element={<About />} />
          <Route
            path="/employees"
            index
            element={
              <EmployeesList
                employeesData={employeesData}
                onEditData={update}
              />
            }
          />
          <Route
            path="/add"
            element={<AddEmployeeForm onAddEmployee={create} />}
          />
          <Route path="/*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
