// components/SingleEmployeeProfile.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import badgeImage from "../../assets/images/pngwing.com.png";
import { useEmploymentTime } from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";

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
  } = useAxios("http://localhost:3005/employees");

  const [updatedData, setUpdatedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
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
      setSuccessMessage("Profile updated successfully.");
    } catch {
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (employee) {
      setUpdatedData({
        ...employee,
        skills: employee.skills.join(", "),
        currentProjects: employee.currentProjects.join(", "),
      });
    }
  };

  const handleDelete = async () => {
    await remove(id);
    navigate("/employees");
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
          ? "Marked as Employee of the Month"
          : "Removed from Employee of the Month"
      );
    } catch {
      setErrorMessage("Failed to toggle Employee of the Month.");
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
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
        {isEditing ? (
          <>
            <form onChange={handleInput} onSubmit={handleSubmit}>
              <select
                name="department"
                value={updatedData.department}
                onChange={handleInput}
              >
                <option value="">Select department</option>
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
                ].map((dpt) => (
                  <option key={dpt} value={dpt}>
                    {dpt}
                  </option>
                ))}
              </select>
              <div className="add-input">
                <p className="white-font">Location:</p>
                <label>
                  <input
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
          <>
            <p className="dpt">
              {employee.department}, {employee.location}{" "}
            </p>
          </>
        )}
      </div>
      <h1>{employee.name}</h1>
      <img
        src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${employee.name}${employee.title}`}
        style={{ height: "200px" }}
        className="card-image"
        alt={employee.name}
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
              //onChange={handleInput}
              placeholder="Name"
            />
            <select name="status" value={updatedData.status}>
              <option value="">Select status</option>
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
              ].map((dpt) => (
                <option key={dpt} value={dpt}>
                  {dpt}
                </option>
              ))}
            </select>
            <div className="add-input">
              <label htmlFor="status" className="white-font">
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={updatedData.status}
                //onChange={handleInput}
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="on vacation">On vacation</option>
                <option value="on parental leave">On parental leave</option>
                <option value="on study leave">On study leave</option>
                <option value="resigned">Resigned</option>
                <option value="retired">Retired</option>
                <option value="specified below">Other (specify below)</option>
              </select>
            </div>

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
              //value={updatedData.skills}
              //onChange={handleInput}
              placeholder="Skills"
              value={updatedData.skills}
              onChange={handleInput}
            />
            <input
              type="text"
              //value={updatedData.currentProjects}
              //onChange={handleInput}
              placeholder="Current Projects"
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
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <label htmlFor="contractType" className="white-font">
                Contract Type:
              </label>
              <select
                id="contractType"
                name="contractType"
                value={updatedData.contractType}
                onChange={handleInput}
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
              <label htmlFor="salary" className="white-font">
                Salary:
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={updatedData.salary}
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
                onChange={handleInput}
              />
            </div>
            <div className="add-input">
              <label htmlFor="otherInfo">Other Information:</label>
              <textarea
                id="otherInfo"
                name="otherInfo"
                rows="4"
                cols="50"
                value={updatedData.otherInfo}
                onChange={handleInput}
              ></textarea>
            </div>
          </form>
        </>
      ) : (
        <>
          {employee.status !== "active" && employee.status !== "other" && (
            <p style={{ fontStyle: "italic", fontWeight: "bold" }}>
              ({employee.status})
            </p>
          )}
          <h1> {employee.name}</h1>
          <p>{employee.title}</p>
          {/*<p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Location:</strong> {employee.location}
          </p>*/}
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
            <strong>Manager:</strong> {employee.manager}
          </p>
          <p>
            <strong>Start Date:</strong> {employee.startDate} (
            {yearsOfEmployment} years of employment)
          </p>
          <p>
            <strong>Contract Type:</strong> {employee.contractType}
          </p>
          <p>
            <strong>Vacation Days Accumulated:</strong>{" "}
            {employee.vacationDaysAcc}
          </p>
          <p>
            <strong>Salary/month:</strong> {employee.salary}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phone}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Home Address:</strong> {employee.homeAddress}
          </p>
          <p>
            <strong>Date of Birth:</strong> {employee.dateOfBirth}
          </p>
          <p>
            <strong>Education:</strong> {employee.education}
          </p>
          <p>
            <strong>Emergency Contact:</strong> {employee.emergencyContact}
          </p>
          <p>
            <strong>Other Information:</strong> {employee.otherInfo}
          </p>
        </>
      )}

      <div>
        <button onClick={() => navigate(-1)}>Go Back</button>
        <Link to={"/employees"}>Back to list</Link>
        {isEditing ? (
          <>
            <button onClick={handleSubmit} disabled={isSaveDisabled}>
              Save details
            </button>
            <button onClick={handleCancel}>Cancel edit</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit details</button>
        )}
      </div>

      <button onClick={toggleEmployeeOfMonth}>
        {employee.employeeOfMonth
          ? 'Remove status "Employee of the Month"'
          : 'Add status "Employee of the Month"'}
      </button>
      <button
        onClick={handleDelete}
        style={{ color: "white", backgroundColor: "red", marginTop: "1rem" }}
      >
        Delete Profile
      </button>
      <div>
        {successMessage && (
          <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
        )}
        {errorMessage && (
          <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SingleEmployeeProfile;
