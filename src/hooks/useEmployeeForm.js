import { useState } from "react";

const emptyForm = () => ({
  name: "",
  title: "",
  department: "",
  location: "",
  skills: [],
  currentProjects: [],
  manager: "",
  startDate: "",
  contractType: "",
  status: "",
  salary: "",
  vacationDaysAcc: "",
  email: "",
  phone: "",
  homeAddress: "",
  dateOfBirth: "",
  education: "",
  emergencyContact: "",
  otherInfo: "",
});

const useEmployeeForm = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(emptyForm());
  };

  return {
    formData,
    setFormData,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    handleEdit,
    handleReset,
  };
};

export default useEmployeeForm;
