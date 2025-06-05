import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import employeeBadgeImage from "../../assets/images/7427018.png";
import badgeIcon from "../../assets/images/icons8-badge-50.png";
import calendarIcon from "../../assets/images/icons8-leave-52.png";
import useEmploymentTime from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import styles from "./SingleEmployeeProfile.module.css";

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

  /*useEffect(
    (isEditing) => {
      if (isEditing(true)) {
        window.scrollTo(0, 0);
      }
    },
    [isEditing.state]
  );*/

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
    //setTimeout(() => window.scrollTo(0, 0), 200);
    //window.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    /*if (confirmed) {
    /*await remove(id);
    setSuccessMessage("Employee profile deleted successfully.");
    setTimeout(() => navigate("/employees"), 3000);*/

    if (confirmed) {
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
    }
  };

  const toggleEmployeeOfMonth = async () => {
    const updatedEmployee = {
      ...employee,
      employeeOfMonth: !employeeOfMonth,
    };
    setLoading(true);
    try {
      await update(id, updatedEmployee);
      setEmployeeOfMonth(!employeeOfMonth);
      setSuccessMessage(
        updatedEmployee.employeeOfMonth
          ? `${employee.name} selected as Employee of the Month`
          : `Employee of the Month -status removed from ${employee.name}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    } catch {
      setErrorMessage("Failed to update Employee of the Month -status.");
      setLoading(false);
    }
  };

  if (loading || !updatedData) return <LoaderSpinner />;
  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error loading profile: {error}
      </p>
    );
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
          <p className={`${styles.message} ${styles.error}`}>{errorMessage}</p>
        )}
        {successMessage && (
          <p className={`${styles.message} ${styles.success}`}>
            {successMessage}
          </p>
        )}
      </div>
      <div className={styles.profileContainer}>
        <div
          className={styles.profileCard}
          //style={isEditing ? { backgroundColor: "#d5d7dc" } : undefined}
          key={id}
        >
          <div
            className={`${getDepartmentClassName(
              updatedData.department
            )} cardHeader`}
            style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
          >
            {isEditing ? (
              <>
                <form onChange={handleInput} onSubmit={handleSubmit}>
                  <div className={styles.bannerInputWrapper}>
                    <div className={styles.departmentWrapper}>
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
                            checked={updatedData.location === "Helsinki"}
                            onChange={handleInput}
                            required
                          />
                          <label
                            htmlFor="Helsinki"
                            className={styles.radioLabel}
                          >
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
                            checked={updatedData.location === "Espoo"}
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
                            checked={updatedData.location === "Tampere"}
                            onChange={handleInput}
                            required
                          />
                          <label
                            htmlFor="Tampere"
                            className={styles.radioLabel}
                          >
                            Tampere
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*<div className="locationWrapper">
                    <p>Location:</p>
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
                  </div>*/}
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
                style={isEditing ? { top: "10.5rem" } : undefined}
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
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="name">Name:</label>
                        <input
                          type="text"
                          name="name"
                          value={updatedData.name}
                          onChange={handleInput}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="title">Title:</label>
                        <input
                          type="text"
                          name="title"
                          value={updatedData.title}
                          onChange={handleInput}
                          placeholder="Title"
                          required
                        />
                      </div>
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="skills">Skills:</label>
                        <input
                          type="text"
                          name="skills"
                          //value={updatedData.skills}
                          //onChange={handleInput}
                          placeholder="comma-separated"
                          value={updatedData.skills}
                          onChange={handleInput}
                        />
                      </div>
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="projects">Current Projects:</label>
                        <input
                          name="currentProjects"
                          id="currentProjects"
                          type="text"
                          //value={updatedData.currentProjects}
                          //onChange={handleInput}
                          placeholder="comma-separated"
                          value={updatedData.currentProjects}
                          onChange={handleInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.managementSection}>
                    <h2>Management:</h2>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="status">Employee Status:</label>
                      <select
                        id="status"
                        name="status"
                        value={updatedData.status}
                        onChange={handleInput}
                        required
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
                      <label htmlFor="manager">Manager:</label>
                      <input
                        type="text"
                        id="manager"
                        name="manager"
                        value={updatedData.manager}
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
                        value={updatedData.startDate}
                        onChange={handleInput}
                        required
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="contractType">Contract Type:</label>
                      <select
                        id="contractType"
                        name="contractType"
                        value={updatedData.contractType}
                        onChange={handleInput}
                        required
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
                      <label htmlFor="salary">Salary/month:</label>
                      <input
                        type="number"
                        id="salary"
                        name="salary"
                        value={updatedData.salary}
                        onChange={handleInput}
                        placeholder="123"
                        required
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="vacationDaysAcc">
                        Vacation Days Accumulated:
                      </label>
                      <input
                        type="number"
                        id="vacationDaysAcc"
                        name="vacationDaysAcc"
                        value={updatedData.vacationDaysAcc}
                        onChange={handleInput}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.personalSection}>
                    <h2>Contact/personal:</h2>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="email">E-mail:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={updatedData.email}
                        onChange={handleInput}
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="phone">Phone:</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={updatedData.phone}
                        onChange={handleInput}
                        placeholder="phone"
                        required
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="homeAddress">Home Address:</label>
                      <input
                        type="text"
                        id="homeAddress"
                        name="homeAddress"
                        value={updatedData.homeAddress}
                        onChange={handleInput}
                        placeholder="Home Address"
                        required
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="dateOfBirth">Date of Birth:</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={updatedData.dateOfBirth}
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
                        value={updatedData.education}
                        placeholder="degree, institution, year"
                        onChange={handleInput}
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="emergencyContact">
                        Emergency Contact:
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={updatedData.emergencyContact}
                        onChange={handleInput}
                        placeholder="name & phone"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.otherInfoSection}>
                    <h2>Other Information</h2>
                    <div className={styles.otherInfoWrapper}>
                      <textarea
                        id="otherInfo"
                        name="otherInfo"
                        rows="6"
                        cols="10"
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
                    <h3>{updatedData.title}</h3>

                    {updatedData.status !== "Active" &&
                    updatedData.status !== "Specified below" ? (
                      <p className={styles.statusText}>
                        ({updatedData.status})
                      </p>
                    ) : (
                      <p style={{ color: "transparent" }}>
                        ({updatedData.status})
                      </p>
                    )}

                    <div
                      className={`${styles.titleDataWrapper} ${styles.skillsWrapper}`}
                    >
                      <label>Skills:</label>
                      <p>{updatedData.skills}</p>
                    </div>
                    <div
                      className={`${styles.titleDataWrapper} ${styles.projectsWrapper}`}
                    >
                      <label>Current Projects:</label>
                      <p>{updatedData.currentProjects}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.managementSection}>
                  <h2>Management</h2>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Employee Status:</label>
                    <p>{updatedData.status}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Manager:</label>
                    <p>{updatedData.manager}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Start Date:</label>
                    <p>
                      {updatedData.startDate} ({yearsOfEmployment} years
                      employed)
                    </p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Contract Type:</label>
                    <p>{updatedData.contractType}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Salary/month:</label>
                    <p>€ {updatedData.salary}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Vacation Days Accumulated:</label>
                    <p>{updatedData.vacationDaysAcc} days</p>
                  </div>
                </div>
                <div className={styles.personalSection}>
                  <h2>Contact/personal</h2>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">E-mail:</label>
                    <p>{updatedData.email}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Phone:</label>
                    <p>{updatedData.phone}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Home Address:</label>
                    <p>{updatedData.homeAddress}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Date of Birth:</label>
                    <p>{updatedData.dateOfBirth}</p>
                  </div>
                  <div
                    className={styles.dataWrapper}
                    style={{ alignItems: "flex-start" }}
                  >
                    <label htmlFor="">Education:</label>
                    <p>{updatedData.education}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label htmlFor="">Emergency Contact:</label>
                    <p>{updatedData.emergencyContact}</p>
                  </div>
                </div>
                <div className={styles.otherInfoSection}>
                  <h2>Other Information</h2>
                  <p>{updatedData.otherInfo}</p>
                </div>
              </div>
            </>
          )}
          <div className={styles.cardFooter}>
            <div className={styles.scheduleContainer}>
              {scheduleProbationReview && (
                <div className={styles.scheduleWrapper}>
                  <img
                    className={styles.scheduleIcon}
                    style={{
                      height: "25px",
                      maxWidth: "25px",
                      alignSelf: "center",
                    }}
                    src={calendarIcon}
                    alt="general-mandatory-action"
                  />

                  <p className={styles.scheduleText}>
                    Schedule 6 months probation review
                  </p>
                </div>
              )}
              {scheduleRecognitionMeeting && (
                <div className={styles.scheduleWrapper}>
                  <img
                    className={styles.scheduleIcon}
                    style={{
                      height: "50px",
                      maxWidth: "50px",
                      alignSelf: "center",
                    }}
                    src={badgeIcon}
                    alt="general-mandatory-action"
                  />

                  <p className={styles.scheduleText}>
                    Schedule recognition meeting
                    <br />({fullYearsOfEmployment} years of employment)
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={toggleEmployeeOfMonth}
              className={styles.employeeBtn}
            >
              {employeeOfMonth
                ? "Remove status Employee of the Month"
                : "Select as Employee of the Month"}
            </button>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={() => navigate("/employees")}>Back to List</button>
          {isEditing ? (
            <>
              <button onClick={handleSubmit} disabled={isSaveDisabled}>
                Save Edit
              </button>
              <button onClick={handleCancel}>Cancel Edit</button>
            </>
          ) : (
            <button
              onClick={() => {
                setTimeout(() => window.scrollTo(0, 0), 250);
                setIsEditing(true);
                //window.scrollTo(0, 0);
              }}
            >
              Edit Profile
            </button>
          )}

          <button onClick={handleDelete}>Delete Profile</button>
        </div>
      </div>
    </>
  );
};

export default SingleEmployeeProfile;
