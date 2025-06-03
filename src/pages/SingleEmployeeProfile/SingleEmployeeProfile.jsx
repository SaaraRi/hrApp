import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import employeeBadgeImage from "../../assets/images/pngwing.com.png";
import useEmploymentTime from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import styles from "./SingleEmployeeProfile.module.scss";

const SingleEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    employeesData: employee,
    read,
    update,
    remove,
    error,
  } = useAxios("http://localhost:3007/employees");

  //const [loading, setLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState(employee);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

    const updatedEmployee = {
      ...updatedData,
      skills: updatedData.skills.split(",").map((s) => s.trim()),
      currentProjects: updatedData.currentProjects
        .split(",")
        .map((p) => p.trim()),
      salary: parseFloat(updatedData.salary),
    };
    setLoading(true);
    try {
      await update(id, updatedEmployee);
      setIsEditing(false);
      setSuccessMessage("Employee profile updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to update employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      setLoading(false);
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
    if (confirmed) {
    await remove(id);
    setSuccessMessage("Employee profile deleted successfully.");
    setTimeout(() => navigate("/employees"), 3000);*/
    setLoading(true);
    try {
      await remove(id);
      setSuccessMessage("Employee profile deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setTimeout(() => navigate("/employees"), 3000);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to delete employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      setLoading(false);
    }
  };

  const toggleEmployeeOfMonth = async () => {
    const updatedEmployee = {
      ...employee,
      employeeOfMonth: !employeeOfMonth,
    };

    try {
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
    <>
      <div>
        {errorMessage && (
          <p
            style={{
              color: "#ff0055",
              fontSize: "18pt",
              marginTop: "3rem",
              zIndex: "5",
            }}
          >
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p
            style={{
              color: "#00955e",
              fontSize: "18pt",
              marginTop: "3rem",
              zIndex: "5",
            }}
          >
            {successMessage}
          </p>
        )}
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.profileCard} key={id}>
          <div
            className={`${getDepartmentClassName(
              updatedData.department
            )} cardHeader`}
            style={{ opacity: "0.8" }}
          >
            {isEditing ? (
              <>
                <form onChange={handleInput} onSubmit={handleSubmit}>
                  <div className="add-input">
                    <label htmlFor="department">Department:</label>
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
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>
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
              <div className={styles.bannerTextWrapper}>
                <p className={styles.dptTitle}>{updatedData.department}</p>

                <p className={styles.locTitle}>{updatedData.location}</p>
              </div>
            )}
          </div>

          {employeeOfMonth && (
            <div className="employeeBadge">
              <img
                src={employeeBadgeImage}
                className={styles.badgeImg}
                alt="Employee of the Month -badge"
              />
            </div>
          )}

          {isEditing ? (
            <>
              <form onChange={handleInput} onSubmit={handleSubmit}>
                <div className={styles.sections}>
                  <div className={styles.titleSection}>
                    <img
                      src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${updatedData.name}${updatedData.title}`}
                      alt={updatedData.name}
                      className={styles.cardImg}
                    />
                    <div className={styles.titleSectionText}>
                      <div>
                        <label htmlFor="name" className="white-font">
                          Name:
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={updatedData.name}
                          onChange={handleInput}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="title" className="white-font">
                          Title:
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={updatedData.title}
                          onChange={handleInput}
                          placeholder="Title"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="skills" className="white-font">
                          Skills:
                        </label>
                        <input
                          type="text"
                          name="skills"
                          //value={updatedData.skills}
                          //onChange={handleInput}
                          placeholder="Skills (comma-separated)"
                          value={updatedData.skills}
                          onChange={handleInput}
                        />
                      </div>
                      <div>
                        <label htmlFor="projects" className="white-font">
                          Current Projects:
                        </label>
                        <input
                          name="currentProjects"
                          id="currentProjects"
                          type="text"
                          //value={updatedData.currentProjects}
                          //onChange={handleInput}
                          placeholder="Current Projects (comma-separated)"
                          value={updatedData.currentProjects}
                          onChange={handleInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.managementSection}>
                    <h2>Management:</h2>
                    <div className="add-input">
                      <label htmlFor="status" className="white-font">
                        Employee Status:
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
                      <label htmlFor="contractType" className="white-font">
                        Contract Type:
                      </label>
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
                        Salary/month:
                      </label>
                      <input
                        type="number"
                        id="salary"
                        name="salary"
                        value={updatedData.salary}
                        placeholder="123"
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
                        placeholder="123"
                        required
                        onChange={handleInput}
                      />
                    </div>
                  </div>
                  <div className={styles.personalSection}>
                    <h2>Contact/personal:</h2>
                    <div className="add-input">
                      <label htmlFor="email" className="white-font">
                        E-mail:
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
                        placeholder="degree, institution, year"
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
                        placeholder="name & phone"
                        required
                        onChange={handleInput}
                      />
                    </div>
                  </div>
                  <div className={styles.otherInfoSection}>
                    <h2>Other Information</h2>
                    <div className="add-input">
                      <textarea
                        id="otherInfo"
                        name="otherInfo"
                        rows="10"
                        cols="50"
                        value={updatedData.otherInfo}
                        onChange={handleInput}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className={styles.sections}>
                <div className={styles.titleSection}>
                  <img
                    src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${updatedData.name}${updatedData.title}`}
                    alt={updatedData.name}
                    className={styles.cardImg}
                  />
                  <div className={styles.titleSectionText}>
                    <h1>{updatedData.name}</h1>
                    {updatedData.status !== "Active" &&
                      updatedData.status !== "Specified below" && (
                        <p style={{ fontStyle: "italic", fontWeight: "bold" }}>
                          ({updatedData.status})
                        </p>
                      )}
                    <p>{updatedData.title}</p>
                    <div>
                      <label>Skills:</label>
                      <p>{updatedData.skills}</p>
                    </div>
                    <div>
                      <label>Current Projects:</label>
                      <p>{updatedData.currentProjects[0]}</p>
                      <p>{updatedData.currentProjects[1]}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.managementSection}>
                  <h2>Management</h2>
                  <div>
                    <label htmlFor="">Employee Status:</label>
                    <p>{updatedData.status}</p>
                  </div>
                  <div>
                    <p>
                      <strong>Manager:</strong> {updatedData.manager}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Start Date:</strong> {updatedData.startDate} (
                      {yearsOfEmployment} years of employment)
                    </p>
                  </div>
                  <div>
                  <p>
                    <strong>Contract Type:</strong> {updatedData.contractType}
                  </p>
                  <p>
                    <strong>Salary/month:</strong> € {updatedData.salary}
                  </p>
                  <p>
                    <strong>Vacation Days Accumulated:</strong>{" "}
                    {updatedData.vacationDaysAcc} days
                  </p>
                </div>
                <div className={styles.personalSection}>
                  <h2>Contact/personal</h2>
                  <p>
                    <strong>E-mail:</strong> {updatedData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {updatedData.phone}
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
                    <strong>Emergency Contact:</strong>{" "}
                    {updatedData.emergencyContact}
                  </p>
                </div>
                <div className={styles.otherInfoSection}>
                  <h2>Other Information</h2>
                  <p>{updatedData.otherInfo}</p>
                </div>
              </div>
            </>
          )}
        </div>
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
    </>
  );
};

export default SingleEmployeeProfile;
