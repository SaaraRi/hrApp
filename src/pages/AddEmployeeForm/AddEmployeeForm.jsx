import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";

const emptyForm = () => ({
  id: "",
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
  employeeOfMonth: false,
});

const AddEmployeeForm = () => {
  const navigate = useNavigate();

  const { create, error } = useAxios("http://localhost:3007/employees");

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //const simulateLoading = (callback) => {
  //  setTimeout(callback, 800);
  //};   simulateLoading(() => setLoading(true));

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmployee = {
      ...formData,
      id: Date.now(),
      skills: formData.skills.split(",").map((s) => s.trim()),
      currentProjects: formData.currentProjects.split(",").map((p) => p.trim()),
      salary: parseFloat(formData.salary),
      employeeOfMonth: false,
    };

    setLoading(true);

    try {
      await create(newEmployee);
      setSuccessMessage("Employee profile created successfully");
      setTimeout(() => setSuccessMessage(""), 5000);
      setTimeout(() => navigate("/employees"), 3000);
      handleReset();
    } catch (error) {
      // setError(error);
      setErrorMessage("Failed to create employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 4000);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(emptyForm);
  };

  if (loading) return <LoaderSpinner />;
  if (error) return <p className="message">Error: {error}</p>;

  return (
    <div className="container">
      <div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
      <form onChange={handleInput} onSubmit={handleSubmit}>
        <h1>Add New Employee</h1>
        <div className="add-input">
          <label htmlFor="name" className="white-font">
            Full Name:
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
            <option value="">Select Department</option>
            {[
              "IT",
              "Design",
              "Development",
              "Product",
              "Finance",
              "Analytics",
              "Marketing",
              "Sales",
              "Legal",
              "Human Resources",
            ].map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
        <div className="add-input">
          <p className="white-font">Select Location:</p>
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
            Skills (comma-separated):
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleInput}
            //required
          />
        </div>
        <div className="add-input">
          <label htmlFor="currentProjects" className="white-font">
            Current Projects (comma-separated):
          </label>
          <input
            type="text"
            id="currentProjects"
            name="currentProjects"
            value={formData.currentProjects}
            onChange={handleInput}
            //required
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
            Contract Type:
          </label>
          <select
            id="contractType"
            name="contractType"
            value={formData.contractType}
            required
            onChange={handleInput}
          >
            <option value="">Select Contract Type</option>
            {[
              "Full-time",
              "Part-time 50%",
              "Part-time 80%",
              "Contractual",
              "Internship",
              "Specified below",
            ].map((contractType) => (
              <option key={contractType} value={contractType}>
                {contractType}
              </option>
            ))}
          </select>
        </div>
        <div className="add-input">
          <label htmlFor="status" className="white-font">
            Employee Status:
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            required
            onChange={handleInput}
          >
            <option value="">Select Employee Status</option>
            {[
              "Active",
              "On Vacation",
              "On Parental Leave",
              "On Study Leave",
              "Resigned",
              "Retired",
              "Specified below",
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="add-input">
          <label htmlFor="salary" className="white-font">
            Salary/month (as number):
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
            Vacation Days Accumulated (as number):
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
            E-mail:
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
            Home Address:
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
            Date of Birth:
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
            Education (degree, institution, year):
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education}
            onChange={handleInput}
            //required
          />
        </div>
        <div className="add-input">
          <label htmlFor="emergencyContact" className="white-font">
            Emergency Contact (name & phone):
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
          <label htmlFor="otherInfo">Other Information:</label>
          <textarea
            id="otherInfo"
            name="otherInfo"
            rows="10"
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
    </div>
  );
};

export default AddEmployeeForm;
