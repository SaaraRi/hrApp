import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { getEmploymentTime } from "../../utilities/employmentTimeUtils.js";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import employeeBadgeImage from "../../assets/images/7427018.png";
import awardBadgeIcon from "../../assets/images/icons8-badge-50.png";
import calendarIcon from "../../assets/images/icons8-leave-52.png";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import styles from "./SingleEmployeeProfile.module.css";

const SingleEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    employeesData: employee,
    read,
    update,
    remove,
    error,
  } = useAxios("https://hrapp-backend5.onrender.com/employees");

  const [updatedData, setUpdatedData] = useState(employee);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
  } = getEmploymentTime(employee?.startDate);

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
    } catch (error) {
      setErrorMessage("Failed to update employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (confirmed) {
      setLoading(true);
      try {
        await remove(id);
        setSuccessMessage("Employee profile deleted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
        setTimeout(() => navigate("/employees"), 3000);
      } catch (error) {
        setErrorMessage("Failed to delete employee profile. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
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
    } catch {
      setErrorMessage("Failed to update Employee of the Month -status.");
    } finally {
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
        <div className={styles.profileCard} key={id}>
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
                        id="department"
                        name="department"
                        value={updatedData.department}
                        onChange={handleInput}
                        required
                      >
                        <option value="">Select department</option>
                        {[
                          "Design",
                          "Development",
                          "Product",
                          "Finance",
                          "Marketing",
                          "Sales",
                          "Analytics",
                          "Customer Relations",
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
                            name="location"
                            id="Helsinki"
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
                            name="location"
                            id="Espoo"
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
                            name="location"
                            id="Tampere"
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
                </form>
              </>
            ) : (
              <div className={styles.bannerTitleWrapper}>
                <p className={styles.bannerTitleDpt}>
                  {updatedData.department}
                </p>
                <p className={styles.bannerTitleLoc}>{updatedData.location}</p>
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
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${updatedData.name}${updatedData.title}`}
                      className={styles.cardImg}
                      alt={updatedData.name}
                    />
                    <div className={styles.titleSectionText}>
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="name">Name:</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={updatedData.name}
                          onChange={handleInput}
                          required
                        />
                      </div>
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="title">Title:</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={updatedData.title}
                          onChange={handleInput}
                          required
                        />
                      </div>
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="skills">Skills:</label>
                        <input
                          type="text"
                          id="skills"
                          name="skills"
                          value={updatedData.skills}
                          onChange={handleInput}
                          placeholder="comma-separated"
                        />
                      </div>
                      <div className={styles.titleInputWrapper}>
                        <label htmlFor="currentProjects">
                          Current projects:
                        </label>
                        <input
                          type="text"
                          id="currentProjects"
                          name="currentProjects"
                          value={updatedData.currentProjects}
                          onChange={handleInput}
                          placeholder="comma-separated"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.managementSection}>
                    <h2>Management:</h2>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="status">Employee status:</label>
                      <select
                        id="status"
                        name="status"
                        value={updatedData.status}
                        onChange={handleInput}
                        required
                      >
                        <option value="">Select employee status</option>
                        {[
                          "Active",
                          "On vacation",
                          "On parental leave",
                          "On study leave",
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
                      <label htmlFor="startDate">Start date:</label>
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
                      <label htmlFor="contractType">Contract type:</label>
                      <select
                        id="contractType"
                        name="contractType"
                        value={updatedData.contractType}
                        onChange={handleInput}
                        required
                      >
                        <option value="">Select contract type</option>
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
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="vacationDaysAcc">
                        Vacation days accumulated:
                      </label>
                      <input
                        type="number"
                        id="vacationDaysAcc"
                        name="vacationDaysAcc"
                        value={updatedData.vacationDaysAcc}
                        onChange={handleInput}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div className={styles.personalSection}>
                    <h2>Contact/Personal:</h2>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="email">E-mail:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={updatedData.email}
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
                        value={updatedData.phone}
                        onChange={handleInput}
                        required
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="homeAddress">Home address:</label>
                      <input
                        type="text"
                        id="homeAddress"
                        name="homeAddress"
                        value={updatedData.homeAddress}
                        onChange={handleInput}
                        required
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="dateOfBirth">Date of birth:</label>
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
                        onChange={handleInput}
                        placeholder="degree, institution, year"
                      />
                    </div>
                    <div className={styles.inputWrapper}>
                      <label htmlFor="emergencyContact">
                        Emergency contact:
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
                    <h2>Other information</h2>
                    <div className={styles.otherInfoWrapper}>
                      <textarea
                        rows="6"
                        cols="10"
                        id="otherInfo"
                        name="otherInfo"
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
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${updatedData.name}${updatedData.title}`}
                    className={styles.cardImg}
                    alt={updatedData.name}
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
                      <label>Current projects:</label>
                      <p>{updatedData.currentProjects}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.managementSection}>
                  <h2>Management</h2>
                  <div className={styles.dataWrapper}>
                    <label>Employee status:</label>
                    <p>{updatedData.status}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Manager:</label>
                    <p>{updatedData.manager}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Start date:</label>
                    <p>
                      {updatedData.startDate} ({yearsOfEmployment} years
                      employed)
                    </p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Contract type:</label>
                    <p>{updatedData.contractType}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Salary/month:</label>
                    <p>€ {updatedData.salary}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Vacation days accumulated:</label>
                    <p>{updatedData.vacationDaysAcc} days</p>
                  </div>
                </div>
                <div className={styles.personalSection}>
                  <h2>Contact/Personal</h2>
                  <div className={styles.dataWrapper}>
                    <label>E-mail:</label>
                    <p>{updatedData.email}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Phone:</label>
                    <p>{updatedData.phone}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Home address:</label>
                    <p>{updatedData.homeAddress}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Date of birth:</label>
                    <p>{updatedData.dateOfBirth}</p>
                  </div>
                  <div
                    className={styles.dataWrapper}
                    style={{ alignItems: "flex-start" }}
                  >
                    <label>Education:</label>
                    <p>{updatedData.education}</p>
                  </div>
                  <div className={styles.dataWrapper}>
                    <label>Emergency contact:</label>
                    <p>{updatedData.emergencyContact}</p>
                  </div>
                </div>
                <div className={styles.otherInfoSection}>
                  <h2>Other information</h2>
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
                    className={`${styles.scheduleIcon} ${styles.calendar}`}
                    src={calendarIcon}
                    alt="Calendar icon"
                  />
                  <p className={styles.scheduleText}>
                    Schedule 6 months probation review
                  </p>
                </div>
              )}
              {scheduleRecognitionMeeting && (
                <div className={styles.scheduleWrapper}>
                  <img
                    className={`${styles.scheduleIcon} ${styles.award}`}
                    src={awardBadgeIcon}
                    alt=" Award badge icon"
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
          <button type="button" onClick={() => navigate("/employees")}>
            Back to List
          </button>
          {isEditing ? (
            <>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaveDisabled}
              >
                Save Edit
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel Edit
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTimeout(() => window.scrollTo(0, 0), 250);
                setIsEditing(true);
              }}
            >
              Edit Profile
            </button>
          )}
          <button type="submit" onClick={handleDelete}>
            Delete Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default SingleEmployeeProfile;
