import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Root from "./pages/Root/Root";
import About from "./pages/About/About";
import EmployeesList from "./pages/EmployeesList/EmployeesList";
import AddEmployeeForm from "./pages/AddEmployeeForm/AddEmployeeForm";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
//import useAxios from "./hooks/useAxios";
import EmployeeProfile from "./pages/EmployeeProfile/EmployeeProfile";

const App = () => {
  //const { employeesData, update } = useAxios("http://localhost:3005/employees");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route
            path="/employees"
            index
            element={
              <EmployeesList
              //employeesData={employeesData}
              //onEditData={update}
              />
            }
          />

          {/*
          <Route
            path="/employees/:id"
            element={
              <EmployeeProfile
              /*singleEmployee={singleEmployee}
            setSingleEmployee={setSingleEmployee}
            onEditData={update}
            onDeleteData={remove}*/}

          <Route
            path="/add"
            element={<AddEmployeeForm /*onAddEmployee={create}*/ />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
