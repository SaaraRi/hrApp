import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import "./EmployeeCard.css";
import badgeImage from "./pngwing.com.png";
import { useEmploymentTime } from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import useAxios from "../../hooks/useAxiosSeka";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";

const EmployeeCard = ({ onEditData, id, ...employee }) => {
  const navigate = useNavigate();
  /*const { success, setSuccess, error, setError, loading, setLoading  } = useAxios(
    "http://localhost:3005"
  );*/
  const { error } = useAxios("http://localhost:3005");

  const {
    fullYearsOfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  } = useEmploymentTime(employee.startDate);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    ...employee,
    skills: employee.skills.join(", "),
    currentProjects: employee.currentProjects.join(", "),
  });

  const simulateLoading = (callback) => {
    setTimeout(callback, 1500);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]:
        name === "skills"
          ? value.split(",").map((skill) => skill.trim())
          : name === "currentProjects"
          ? value.split(",").map((project) => project.trim())
          : value,
    }));
  };

  /*  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEmployee = {
      ...updatedData,
      skills: updatedData.skills.split(",").map((skill) => skill.trim()),
      currentProjects: updatedData.currentProjects
        .split(",")
        .map((project) => project.trim()),
      salary: parseFloat(updatedData.salary),
    };

    simulateLoading(() => {
      try {
        onEditData(id, updatedEmployee); // ← This calls update from EmployeesList/useAxios
        setIsEditing(false);
        setSuccessMessage("Employee profile updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage("Failed to update employee profile. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    });
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedEmployee = {
      ...updatedData,
      skills: updatedData.skills.split(",").map((skill) => skill.trim()),
      currentProjects: updatedData.currentProjects
        .split(",")
        .map((project) => project.trim()),
      salary: parseFloat(updatedData.salary),
    };

    try {
      await onEditData(id, updatedEmployee);
      setIsEditing(false);
      setSuccessMessage("Employee profile updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to update employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  /*
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEmployee = {
      ...updatedData,
      skills: updatedData.skills.split(",").map((skill) => skill.trim()),
      currentProjects: updatedData.currentProjects
        .split(",")
        .map((project) => project.trim()),
      salary: parseFloat(updatedData.salary),
    };

    simulateLoading(() => setLoading(true));
    try {
      onEditData(id, updatedEmployee);
      //setEmployeesData(updatedEmployee);
      setIsEditing(false);
      setSuccessMessage("Employee profile updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      simulateLoading(() => setLoading(false));
    } catch (error) {
      setErrorMessage("Failed to update employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      throw error;
    } finally {
      simulateLoading(() => setLoading(false));
    }
  };*/

  const handleCancel = () => {
    setUpdatedData(employee);
    setIsEditing(false);
  };

  const isSaveDisabled =
    !updatedData || JSON.stringify(updatedData) === JSON.stringify(employee);

  if (loading) return <LoaderSpinner />;
  if (error) return <p className="message">Error: {error}</p>;
  if (!employee) return <p className="message">Employee profile not found.</p>;

  return (
    <div className="card" key={id}>
      {scheduleProbationReview && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Schedule probation review
        </p>
      )}
      {scheduleRecognitionMeeting && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Schedule recognition meeting, {fullYearsOfEmployment} years with the
          company
        </p>
      )}
      <div
        className={`${getDepartmentClassName(employee.department)}`}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p className="dpt">
          {employee.department}, {employee.location}{" "}
        </p>
      </div>
      <img
        src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${employee.name}${employee.title}`}
        className="cardImg"
        alt={employee.name}
      />

      {employee.employeeOfMonth && (
        <img
          src={badgeImage}
          className="badgeImg"
          alt="Employee of the Month -badge"
        />
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
          <select
            name="status"
            value={updatedData.status}
            onChange={handleInput}
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="on vacation">On vacation</option>
            <option value="on parental leave">On parental leave</option>
            <option value="on study leave">On study leave</option>
            <option value="resigned">Resigned</option>
            <option value="retired">Retired</option>
            <option value="other">Other (specify on Profile page)</option>
          </select>

          <input
            type="text"
            name="title"
            value={updatedData.title}
            onChange={handleInput}
            placeholder="Title"
          />
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
          <p>Location:</p>
          <div className="radio-div">
            <label className="loc-radio">
              <input
                type="radio"
                name="location"
                value="Helsinki"
                checked={updatedData.location === "Helsinki"}
                onChange={handleInput}
              />
              Helsinki
            </label>
            <label className="loc-radio">
              <input
                type="radio"
                name="location"
                value="Espoo"
                checked={updatedData.location === "Espoo"}
                onChange={handleInput}
              />
              Espoo
            </label>
            <label className="loc-radio">
              <input
                type="radio"
                name="location"
                value="Tampere"
                checked={updatedData.location === "Tampere"}
                onChange={handleInput}
              />
              Tampere
            </label>
          </div>

          <input
            type="text"
            name="skills"
            value={updatedData.skills}
            onChange={handleInput}
            placeholder="Skills"
          />

          <input
            type="text"
            name="currentProjects"
            value={updatedData.currentProjects}
            onChange={handleInput}
            placeholder="Current projects"
          />

          <input
            type="text"
            name="email"
            value={updatedData.email}
            onChange={handleInput}
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={updatedData.phone}
            onChange={handleInput}
            placeholder="Phone"
          />
        </>
      ) : (
        <>
          <p>{employee.name}</p>
          {employee.status !== "active" && employee.status !== "other" && (
            <p style={{ fontStyle: "italic", fontWeight: "bold" }}>
              ({employee.status})
            </p>
          )}
          <p>{employee.title}</p>
          <p>
            Skills: {employee.skills}
            {/*employee.skills.map((skill) => skill.trim()).join(", ")*/}
          </p>
          <p>
            Current projects:{employee.currentProjects}
            {/*employee.currentProjects
              .map((project) => project.trim())
              .join(", ")*/}
          </p>
          <p>Contact:</p>
          <p>Phone: {employee.phone}</p>
          <p>Email: {employee.email}</p>
        </>
      )}

      <div>
        <Link to={`/employees/${id}`}>See full profile</Link>
        <button
          onClick={() => navigate(`/employees/${id}`)}
          text={"See details"}
        >
          See details
        </button>
        {isEditing ? (
          <>
            <button onClick={handleSubmit} disabled={isSaveDisabled}>
              Save
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
      <div>
        {errorMessage && (
          <p className="message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="message" style={{ color: "green" }}>
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
