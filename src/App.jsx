import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Root from "./pages/Root/Root";
import About from "./pages/About/About";
import EmployeesList from "./pages/EmployeesList/EmployeesList";
import AddEmployeeForm from "./pages/AddEmployeeForm/AddEmployeeForm";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import SingleEmployeeProfile from "./pages/SingleEmployeeProfile/SingleEmployeeProfile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Navigate to="/employees" replace />} />
          <Route path="/employees" index element={<EmployeesList />} />
          <Route path="/employees/:id" element={<SingleEmployeeProfile />} />
          <Route path="/add" element={<AddEmployeeForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
