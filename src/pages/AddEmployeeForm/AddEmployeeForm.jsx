import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import styles from "./AddEmployeeForm.module.css";

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
      skills: formData.skills.split(",").map((s) => s.trim()),
      currentProjects: formData.currentProjects.split(",").map((p) => p.trim()),
      salary: parseFloat(formData.salary),
      employeeOfMonth: false,
    };

    setLoading(true);

    try {
      await create(newEmployee);
      setSuccessMessage("Employee profile created successfully");
      setTimeout(() => setSuccessMessage(""), 3000);

      //navigate("/employees");
      setTimeout(() => navigate("/employees"), 3000);
      setLoading(false);
      handleReset();
    } catch (error) {
      // setError(error);
      setErrorMessage("Failed to create employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(emptyForm);
    //window.scrollTo({ top: 0, behavior: "smooth" });
    //window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 800);
  };

  if (loading) return <LoaderSpinner />;
  if (error)
    return (
      <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>
    );

  return (
    <>
      <div>
        {errorMessage && (
          <p className={`${styles.message} ${styles.error}`}>{errorMessage}</p>
        )}
        {successMessage && (
          <p className={`${styles.message} ${styles.success}`}>
            {successMessage}
          </p>
        )}
      </div>
      <div className={styles.formContainer}>
        <form
          className={styles.form}
          onChange={handleInput}
          onSubmit={handleSubmit}
        >
          <h1>Add New Employee</h1>
          <div className={styles.inputWrapper}>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInput}
              required
            >
              <option value="">Select Department</option>
              {[
                "Design",
                "Development",
                "Product",
                "Finance",
                "Marketing",
                "Sales",
                "Analytics",
                "IT",
                "Legal",
                "Human Resources",
              ].map((department) => (
                <option
                  key={department}
                  value={department}
                  className={getDepartmentClassName(department)}
                  id="dpt-select"
                >
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.locationWrapper}>
            <label className={styles.locationLabel}>Location:</label>
            <div className={styles.radioContainer}>
              <div className={styles.radioWrapper}>
                <input
                  className={styles.radioInput}
                  type="radio"
                  id="Helsinki"
                  name="location"
                  value="Helsinki"
                  checked={formData.location === "Helsinki"}
                  onChange={handleInput}
                  required
                />
                <label htmlFor="Helsinki" className={styles.radioLabel}>
                  Helsinki
                </label>
              </div>
              <div className={styles.radioWrapper}>
                <input
                  className={styles.radioInput}
                  type="radio"
                  id="Espoo"
                  name="location"
                  value="Espoo"
                  checked={formData.location === "Espoo"}
                  onChange={handleInput}
                  required
                />
                <label htmlFor="Espoo" className={styles.radioLabel}>
                  Espoo
                </label>
              </div>
              <div className={styles.radioWrapper}>
                <input
                  className={styles.radioInput}
                  type="radio"
                  id="Tampere"
                  name="location"
                  value="Tampere"
                  checked={formData.location === "Tampere"}
                  onChange={handleInput}
                  required
                />
                <label htmlFor="Tampere" className={styles.radioLabel}>
                  Tampere
                </label>
              </div>
            </div>
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="skills">Skills:</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInput}
              placeholder="comma-separated"
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="currentProjects">Current Projects:</label>
            <input
              type="text"
              id="currentProjects"
              name="currentProjects"
              value={formData.currentProjects}
              onChange={handleInput}
              placeholder="comma-separated"
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="manager">Manager:</label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="contractType">Contract Type:</label>
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
          <div className={styles.inputWrapper}>
            <label htmlFor="status">Employee Status:</label>
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
          <div className={styles.inputWrapper}>
            <label htmlFor="salary">Salary/month:</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleInput}
              placeholder="123"
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="vacationDaysAcc">Vacation Days Accumulated:</label>
            <input
              type="number"
              id="vacationDaysAcc"
              name="vacationDaysAcc"
              value={formData.vacationDaysAcc}
              onChange={handleInput}
              placeholder="123"
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="homeAddress">Home Address:</label>
            <input
              type="text"
              id="homeAddress"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInput}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="education">Education:</label>
            <input
              type="text"
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInput}
              placeholder="degree, institution, year"
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="emergencyContact">Emergency Contact:</label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInput}
              placeholder="name & phone"
              required
            />
          </div>
          <div className={styles.otherInfoWrapper}>
            <label htmlFor="otherInfo" className={styles.otherInfoLabel}>
              Other Information:
            </label>
            <textarea
              className={styles.otherInfoText}
              id="otherInfo"
              name="otherInfo"
              rows="6"
              cols="50"
              value={formData.otherInfo}
              onChange={handleInput}
            ></textarea>
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={() => navigate("/employees")}>Back to List</button>
            <button type="submit">Add Employee</button>
            <button type="button" onClick={handleReset}>
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEmployeeForm;
