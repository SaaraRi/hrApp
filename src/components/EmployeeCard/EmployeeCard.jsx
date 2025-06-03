import { useNavigate } from "react-router";
import employeeBadgeImage from "../../assets/images/pngwing.com.png";
import badgeIcon from "../../assets/images/icons8-badge-100.png";
import calendarIcon from "../../assets/images/icons8-leave-52.png";
import useEmploymentTime from "../../hooks/useEmploymentTime";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import styles from "./EmployeeCard.module.css";

const EmployeeCard = ({ employee }) => {
  const navigate = useNavigate();

  const {
    id,
    name,
    title,
    department,
    location,
    status,
    skills,
    currentProjects,
    startDate,
    phone,
    email,
    employeeOfMonth,
  } = employee;

  const {
    fullYearsOfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  } = useEmploymentTime(employee.startDate);

  //if (loading) return <LoaderSpinner />;
  if (!employee)
    return (
      <LoaderSpinner /> && (
        <p className="message">Employee profile not found.</p>
      )
    );

  return (
    <div className={styles.card} key={id}>
      <div
        className={`${getDepartmentClassName(department)} cardHeader`}
        style={{ opacity: "0.8" }}
      >
        <div className={styles.bannerTextWrapper}>
          <p className={styles.dptTitle}>{department}</p>

          <p className={styles.locTitle}>{location}</p>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardContainer}>
          <div className={styles.imgContainer}>
            <img
              src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${name}${title}`}
              className={styles.cardImg}
              alt={name}
            />

            {employeeOfMonth && (
              <img
                src={employeeBadgeImage}
                className={styles.badgeImg}
                alt="Employee of the Month -badge"
              />
            )}
            <div className={styles.imgTextWrapper}>
              <h3>{name}</h3>
              <div>
                <h4>{title}</h4>
                {status !== "Active" && status !== "Specified below" ? (
                  <p className={styles.statusText}>({status})</p>
                ) : (
                  <p style={{ color: "transparent" }}>({status})</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.textContainer}>
            <div className={styles.skillsWrapper}>
              <h5>Skills:</h5>
              <p>{skills.join(", ")}</p>
            </div>
            <div className={styles.projectsWrapper}>
              <h5>Current Projects:</h5>
              <p>{currentProjects[0]},</p>
              <p>{currentProjects[1]}</p>
            </div>
            <div className={styles.contactWrapper}>
              <h5>Contact:</h5>
              <p>{phone}</p>
              <p>{email}</p>
            </div>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.scheduleContainer}>
            {scheduleProbationReview && (
              <div className={styles.scheduleWrapper}>
                <img
                  className={styles.scheduleIcon}
                  style={{ height: "30px", maxWidth: "30px" }}
                  src={calendarIcon}
                  alt="general-mandatory-action"
                />
                <div className={styles.scheduleTextWrapper}>
                  <p className={styles.scheduleText}>Schedule 6 months </p>
                  <p className={styles.scheduleText}>probation review</p>
                </div>
              </div>
            )}
            {scheduleRecognitionMeeting && (
              <div className={styles.scheduleWrapper}>
                <img
                  className={styles.scheduleIcon}
                  style={{ height: "33px", maxWidth: "33px" }}
                  src={badgeIcon}
                  alt="general-mandatory-action"
                />
                <div className={styles.scheduleTextWrapper}>
                  <p className={styles.scheduleText}>
                    Schedule recognition meeting{" "}
                  </p>
                  <p className={styles.scheduleText}>
                    ({fullYearsOfEmployment} years at the company)
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className={styles.buttons}>
            <button
              onClick={() =>
                navigate(`/employees/${employee.id}`, {
                  state: { editMode: false },
                })
              }
            >
              View Profile
            </button>
            <button
              onClick={() =>
                navigate(`/employees/${employee.id}`, {
                  state: { editMode: true },
                })
              }
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
