import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import badgeImage from "../../assets/images/pngwing.com.png";
import useEmploymentTime from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import "./SingleEmployeeProfile.css";

const SingleEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    employeesData: employee,
    read,
    update,
    remove,
    error,
    loading,
  } = useAxios("http://localhost:3007/employees");

  //const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState(employee);
  const [isEditing, setIsEditing] = useState(false);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.editMode) {
      setIsEditing(true);
    }
  }, [location.state]);

  useEffect(() => {
    read(id);
  }, [id]);

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
    }
  }, [employee]);

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
    /*const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (confirmed) {*/
    await remove(id);
    setSuccessMessage("Profile successfully deleted.");
    setTimeout(() => navigate("/employees"), 3000);
  };

  const toggleEmployeeOfMonth = async () => {
    try {
      const updatedEmployee = {
        ...employee,
        employeeOfMonth: !employeeOfMonth,
      };
      await update(id, updatedEmployee);
      setEmployeeOfMonth(!employeeOfMonth);
      setSuccessMessage(
        updatedEmployee.employeeOfMonth
          ? `${employee.name} selected as Employee of the Month`
          : `Employee of the Month - status removed from ${employee.name}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("Failed to update Employee of the Month -status.");
    }
  };

  if (loading || !updatedData) return <LoaderSpinner />;
  if (error) {
    return <p className="message">Error loading profile: {error}</p>;
  }

  const isSaveDisabled =
    JSON.stringify({
      ...employee,
      skills: employee.skills.join(", "),
      currentProjects: employee.currentProjects.join(", "),
    }) === JSON.stringify(updatedData);

  return (
    <div className="profilePage" key={id}>
      <div>
        {successMessage && (
          <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
        )}
        {errorMessage && (
          <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
        )}
      </div>
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
            <form onChange={handleInput} onSubmit={handleSubmit}>
              <select
                className="dpt"
                id="department"
                name="department"
                value={updatedData.department}
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
              <div className="add-input">
                <p className="white-font">Location:</p>
                <label>
                  <input
                    className="loc"
                    id="Helsinki"
                    type="radio"
                    name="location"
                    value="Helsinki"
                    checked={updatedData.location === "Helsinki"}
                    onChange={handleInput}
                  />
                  Helsinki
                </label>
                <label>
                  <input
                    className="loc"
                    id="Espoo"
                    type="radio"
                    name="location"
                    value="Espoo"
                    checked={updatedData.location === "Espoo"}
                    onChange={handleInput}
                  />
                  Espoo
                </label>
                <label>
                  <input
                    className="loc"
                    id="Tampere"
                    type="radio"
                    name="location"
                    value="Tampere"
                    checked={updatedData.location === "Tampere"}
                    onChange={handleInput}
                  />
                  Tampere
                </label>
              </div>
            </form>
          </>
        ) : (
          <p className="dpt">
            {updatedData.department}, {updatedData.location}
          </p>
        )}
      </div>

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
            alt="Employee of the Month -badge"
          />
        </div>
      )}

      {isEditing ? (
        <>
          <form onChange={handleInput} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleInput}
              placeholder="Full name"
              required
            />
            <div className="add-input">
              <label htmlFor="status" className="white-font">
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={updatedData.status}
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

            <input
              type="text"
              name="title"
              value={updatedData.title}
              onChange={handleInput}
              placeholder="Title"
              required
            />
            <input
              type="text"
              name="skills"
              //value={updatedData.skills}
              //onChange={handleInput}
              placeholder="Skills (comma-separated)"
              value={updatedData.skills}
              onChange={handleInput}
            />
            <input
              type="text"
              //value={updatedData.currentProjects}
              //onChange={handleInput}
              placeholder="Current Projects (comma-separated)"
              value={updatedData.currentProjects}
              onChange={handleInput}
            />
            <div className="add-input">
              <label htmlFor="manager" className="white-font">
                Manager:
              </label>
              <input
                type="text"
                id="manager"
                name="manager"
                value={updatedData.manager}
                required
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <label htmlFor="startDate" className="white-font">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={updatedData.startDate}
                required
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <select
                id="contractType"
                name="contractType"
                value={updatedData.contractType}
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
              <label htmlFor="salary" className="white-font">
                Salary:
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={updatedData.salary}
                placeholder="Salary/month"
                required
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <label htmlFor="vacationDaysAcc" className="white-font">
                Vacation Days Accumulated:
              </label>
              <input
                type="number"
                id="vacationDaysAcc"
                name="vacationDaysAcc"
                value={updatedData.vacationDaysAcc}
                placeholder="Vacation Days Accumulated"
                required
                onChange={handleInput}
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
                value={updatedData.email}
                placeholder="Email"
                required
                onChange={handleInput}
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
                value={updatedData.phone}
                placeholder="phone"
                required
                onChange={handleInput}
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
                value={updatedData.homeAddress}
                placeholder="Home Address"
                required
                onChange={handleInput}
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
                value={updatedData.dateOfBirth}
                required
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <label htmlFor="education" className="white-font">
                Education:
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={updatedData.education}
                placeholder="Education (degree, institution, year)"
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <label htmlFor="emergencyContact" className="white-font">
                Emergency Contact:
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={updatedData.emergencyContact}
                placeholder="Emergency Contact"
                required
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <label htmlFor="otherInfo">Other Information:</label>
              <textarea
                id="otherInfo"
                name="otherInfo"
                rows="10"
                cols="50"
                value={updatedData.otherInfo}
                onChange={handleInput}
              ></textarea>
            </div>
          </form>
        </>
      ) : (
        <>
          <h1>{updatedData.name}</h1>

          {updatedData.status !== "active" &&
            updatedData.status !== "other" && (
              <p style={{ fontStyle: "italic", fontWeight: "bold" }}>
                ({updatedData.status})
              </p>
            )}
          <p>{updatedData.title}</p>
          {/*<p>
        <strong>Department:</strong> {employee.department}
      </p>
      <p>
        <strong>Location:</strong> {employee.location}
      </p>
          <div>
            <p>Skills:</p>
            {(employee.skills || []).map((skill) => (
              <span key={skill}>{skill} </span>
            ))}
          </div>
          <div>
            <p>Current Projects:</p>
            {(employee.currentProjects || []).map((project) => (
              <span key={project}>{project} </span>
            ))}
          </div>
          {/*
          <div>
            <p>Skills:</p>
            {employee.skills.map((skill) => (
              <span key={skill}>{skill} </span>
            ))}
          </div>
          <div>
            <p>Current Projects:</p>
            {employee.currentProjects.map((project) => (
              <span key={project}>{project} </span>
            ))}
          </div>
          */}
          <p>
            <strong>Skills:</strong> {updatedData.skills}
          </p>
          <p>
            <strong>Current Projects:</strong> {updatedData.currentProjects}
          </p>
          <p>
            <strong>Manager:</strong> {updatedData.manager}
          </p>
          <p>
            <strong>Start Date:</strong> {updatedData.startDate} (
            {yearsOfEmployment} years of employment)
          </p>
          <p>
            <strong>Contract Type:</strong> {updatedData.contractType}
          </p>
          <p>
            <strong>Vacation Days Accumulated:</strong>{" "}
            {updatedData.vacationDaysAcc}
          </p>
          <p>
            <strong>Salary/month:</strong> {updatedData.salary}
          </p>
          <p>
            <strong>Phone:</strong> {updatedData.phone}
          </p>
          <p>
            <strong>Email:</strong> {updatedData.email}
          </p>
          <p>
            <strong>Home Address:</strong> {updatedData.homeAddress}
          </p>
          <p>
            <strong>Date of Birth:</strong> {updatedData.dateOfBirth}
          </p>
          <p>
            <strong>Education:</strong> {updatedData.education}
          </p>
          <p>
            <strong>Emergency Contact:</strong> {updatedData.emergencyContact}
          </p>
          <p>
            <strong>Other Information:</strong> {updatedData.otherInfo}
          </p>
        </>
      )}

      <div>
        <button onClick={() => navigate("/employees")}>Back to List</button>
        {isEditing ? (
          <>
            <button onClick={handleSubmit} disabled={isSaveDisabled}>
              Save Changes
            </button>
            <button onClick={handleCancel}>Cancel Edit</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Details</button>
        )}
        <button onClick={toggleEmployeeOfMonth}>
          {employeeOfMonth
            ? "Remove status Employee of the Month"
            : "Select as Employee of the Month"}
        </button>
        <button
          onClick={handleDelete}
          style={{ color: "white", backgroundColor: "red" }}
        >
          {" "}
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default SingleEmployeeProfile;
