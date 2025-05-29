import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import badgeImage from "./pngwing.com.png";
import { useEmploymentTime } from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    employeesData: employee,
    read,
    update,
    remove,
    error,
  } = useAxios(`http://localhost:3005/employees/${id}`);

  const [updatedData, setUpdatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch employee on mount
  useEffect(() => {
    read();
  }, []);

  useEffect(() => {
    if (employee) {
      setUpdatedData({
        ...employee,
        skills: Array.isArray(employee.skills)
          ? employee.skills.join(", ")
          : "",
        currentProjects: Array.isArray(employee.currentProjects)
          ? employee.currentProjects.join(", ")
          : "",
      });
      setEmployeeOfMonth(employee.employeeOfMonth || false);
      setLoading(false);
    }
  }, [employee]);

  // Only call this hook once employee is loaded
  const {
    yearsOfEmployment,
    fullYearsOfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  } = useEmploymentTime(employee?.startDate);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = {
        ...updatedData,
        skills: updatedData.skills.split(",").map((s) => s.trim()),
        currentProjects: updatedData.currentProjects
          .split(",")
          .map((p) => p.trim()),
        salary: parseFloat(updatedData.salary),
      };

      await update(id, updatedEmployee);
      setIsEditing(false);
      setSuccessMessage("Employee profile updated successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("Failed to update employee. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedData({
      ...employee,
      skills: employee.skills.join(", "),
      currentProjects: employee.currentProjects.join(", "),
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (confirmed) {
      await remove(id);
      setSuccessMessage("Profile deleted.");
      setTimeout(() => navigate("/employees"), 3000);
    }
  };

  const handleToggleEmployeeOfMonth = async () => {
    try {
      const updatedEmployee = {
        ...employee,
        employeeOfMonth: !employeeOfMonth,
      };
      await update(id, updatedEmployee);
      setEmployeeOfMonth(!employeeOfMonth);
      setSuccessMessage(
        updatedEmployee.employeeOfMonth
          ? "Marked as Employee of the Month"
          : "Removed from Employee of the Month"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("Failed to update Employee of the Month status.");
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (loading || !updatedData) return <LoaderSpinner />;

  const isSaveDisabled =
    JSON.stringify({
      ...employee,
      skills: employee.skills.join(", "),
      currentProjects: employee.currentProjects.join(", "),
    }) === JSON.stringify(updatedData);

  return (
    <div className="profilePage" key={id}>
      {scheduleProbationReview && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Schedule probation review
        </p>
      )}
      {scheduleRecognitionMeeting && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Schedule recognition meeting — {fullYearsOfEmployment} years at the
          company
        </p>
      )}

      <div className={getDepartmentClassName(updatedData.department)}>
        {isEditing ? (
          <>
            <select
              name="department"
              value={updatedData.department}
              onChange={handleInput}
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
              <option value="Human Resources">Human Resources</option>
            </select>
            {/* Add radio buttons or other inputs here if needed */}
          </>
        ) : (
          <p className="dpt">
            {updatedData.department}, {updatedData.location}
          </p>
        )}
      </div>

      <h1>{updatedData.name}</h1>
      <img
        src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${updatedData.name}${updatedData.title}`}
        alt={updatedData.name}
        className="card-image"
        style={{ height: "200px" }}
      />

      {employeeOfMonth && (
        <div className="employeeBadge">
          <img
            src={badgeImage}
            className="badgeImg"
            alt="Employee of the Month badge"
          />
        </div>
      )}

      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={updatedData.name}
            onChange={handleInput}
            placeholder="Name"
          />
          <input
            type="text"
            name="title"
            value={updatedData.title}
            onChange={handleInput}
            placeholder="Title"
          />
          <input
            type="text"
            name="skills"
            value={updatedData.skills}
            onChange={handleInput}
            placeholder="Skills (comma-separated)"
          />
          <input
            type="text"
            name="currentProjects"
            value={updatedData.currentProjects}
            onChange={handleInput}
            placeholder="Projects (comma-separated)"
          />
          {/* Add more fields as needed */}
          <button onClick={handleSubmit} disabled={isSaveDisabled}>
            Save
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <p>
            <strong>Title:</strong> {updatedData.title}
          </p>
          <p>
            <strong>Skills:</strong> {updatedData.skills}
          </p>
          <p>
            <strong>Projects:</strong> {updatedData.currentProjects}
          </p>
          <p>
            <strong>Start Date:</strong> {updatedData.startDate} (
            {yearsOfEmployment} years)
          </p>
          {/* Add more read-only fields as needed */}
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}

      <button onClick={handleToggleEmployeeOfMonth}>
        {employeeOfMonth
          ? "Remove Employee of the Month"
          : "Mark as Employee of the Month"}
      </button>
      <button
        onClick={handleDelete}
        style={{ color: "white", backgroundColor: "red" }}
      >
        Delete Profile
      </button>

      {successMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
      )}
      {errorMessage && (
        <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
      )}
      <Link to="/employees">Back to list</Link>
    </div>
  );
};

export default EmployeeProfile;
