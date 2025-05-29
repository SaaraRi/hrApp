import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import useEmployeeForm from "../../hooks/useEmployeeForm";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";

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

const AddEmployeeForm = () => {
  const navigate = useNavigate();

  /*const {
    formData,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    handleInput,
    handleReset,
  } = useEmployeeForm();*/

  const { create, error, setError } = useAxios(
    "http://localhost:3005/employees"
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const simulateLoading = (callback) => {
    setTimeout(callback, 800);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "skills"
          ? value.split(",").map((skill) => skill.trim())
          : name === "currentProjects"
          ? value.split(",").map((project) => project.trim())
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEmployee = {
        ...formData,
        salary: parseFloat(formData.salary),
        skills:
          typeof formData.skills === "string"
            ? formData.skills.split(",").map((s) => s.trim())
            : formData.skills,
        currentProjects:
          typeof formData.currentProjects === "string"
            ? formData.currentProjects.split(",").map((p) => p.trim())
            : formData.currentProjects,
      };

      await create(newEmployee);
      setSuccessMessage("Employee profile updated successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("Failed to update employee. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };
  /*const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(emptyForm());
  };*/

  //const [formData, setFormData] = useState(emptyForm);
  //const [successMessage, setSuccessMessage] = useState("");
  //const [errorMessage, setErrorMessage] = useState("");

  /*const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };*/

  /*

  const handleSave = async (e) => {
    e.preventDefault();
    const newEmployee = {
      ...formData,
      skills: formData.skills.split(",").map((skill) => skill.trim()),
      currentProjects: formData.currentProjects
        .split(",")
        .map((project) => project.trim()),
      salary: parseFloat(formData.salary),
    };

    try {
      simulateLoading(() => setLoading(true));
      await create(newEmployee);
      setSuccessMessage("Employee profile added successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setTimeout(() => navigate("/employees"), 4000);
      simulateLoading(() => setLoading(false));
      handleReset();
    } catch (error) {
      setError(error);
      setErrorMessage("Failed to add employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      simulateLoading(() => setLoading(false));
    }
  };*/

  const handleReset = () => {
    setFormData(emptyForm);
  };

  if (loading) return <LoaderSpinner />;
  if (error) return <p className="message">Error: {error}</p>;

  return (
    <div className="container">
      <h1>Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="add-input">
          <label htmlFor="name" className="white-font">
            Full name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="title" className="white-font">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="department" className="white-font">
            Department:
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInput}
            required
          >
            <option value="">Select department</option>
            <option value="IT">IT</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Product">Product</option>
            <option value="Finance">Finance</option>
            <option value="Analytics">Analytics</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Legal">Legal</option>
            <option value="Human resources">Human Resources</option>
          </select>
        </div>
        <div className="add-input">
          <p className="white-font">Select location:</p>
          <label>
            <input
              type="radio"
              name="location"
              value="Helsinki"
              checked={formData.location === "Helsinki"}
              onChange={handleInput}
              required
            />
            Helsinki
          </label>
          <label>
            <input
              type="radio"
              name="location"
              value="Espoo"
              checked={formData.location === "Espoo"}
              onChange={handleInput}
              required
            />
            Espoo
          </label>
          <label>
            <input
              type="radio"
              name="location"
              value="Tampere"
              checked={formData.location === "Tampere"}
              onChange={handleInput}
              required
            />
            Tampere
          </label>
        </div>
        <div className="add-input">
          <label htmlFor="skills" className="white-font">
            Skills (separate with a comma):
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="currentProjects" className="white-font">
            Current projects (separate with a comma):
          </label>
          <input
            type="text"
            id="currentProjects"
            name="currentProjects"
            value={formData.currentProjects}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="manager" className="white-font">
            Manager:
          </label>
          <input
            type="text"
            id="manager"
            name="manager"
            value={formData.manager}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="startDate" className="white-font">
            Start date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="contractType" className="white-font">
            Contract type:
          </label>
          <select
            id="contractType"
            name="contractType"
            value={formData.contractType}
            onChange={handleInput}
            required
          >
            <option value="">Select contract type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time 50%">Part-time 50%</option>
            <option value="Part-time 80%">Part-time 80%</option>
            <option value="Contractual">Contractual</option>
            <option value="Internship">Internship</option>
            <option value="Other">Other (specify below)</option>
          </select>
        </div>
        <div className="add-input">
          <label htmlFor="status" className="white-font">
            Status:
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInput}
            required
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="on vacation">On vacation</option>
            <option value="on parental leave">On parental leave</option>
            <option value="on study leave">On study leave</option>
            <option value="resigned">Resigned</option>
            <option value="retired">Retired</option>
            <option value="other">Other (specify below)</option>
          </select>
        </div>
        <div className="add-input">
          <label htmlFor="salary" className="white-font">
            Salary (as number):
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="vacationDaysAcc" className="white-font">
            Vacation days accumulated (as number):
          </label>
          <input
            type="number"
            id="vacationDaysAcc"
            name="vacationDaysAcc"
            value={formData.vacationDaysAcc}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="email" className="white-font">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="phone" className="white-font">
            Phone:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="homeAddress" className="white-font">
            Home address:
          </label>
          <input
            type="text"
            id="homeAddress"
            name="homeAddress"
            value={formData.homeAddress}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="dateOfBirth" className="white-font">
            Date of birth:
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="education" className="white-font">
            Education (degree, school, year):
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="emergencyContact" className="white-font">
            Emergency contact (name and phone):
          </label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInput}
            required
          />
        </div>
        <div className="add-input">
          <label htmlFor="otherInfo">Other information:</label>
          <textarea
            id="otherInfo"
            name="otherInfo"
            rows="4"
            cols="50"
            value={formData.otherInfo}
            onChange={handleInput}
          ></textarea>
        </div>
        <button type="submit" className="add-btn">
          Add employee
        </button>
        <button type="button" onClick={handleReset}>
          Reset form
        </button>
        <button onClick={() => navigate("/employees")}>Back to list</button>
      </form>
      <div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default AddEmployeeForm;
