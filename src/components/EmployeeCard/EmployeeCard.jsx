import { useNavigate } from "react-router";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import employeeBadgeImage from "../../assets/images/7427018.png";
import awardBadgeIcon from "../../assets/images/icons8-badge-50.png";
import calendarIcon from "../../assets/images/icons8-leave-52.png";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";
import styles from "./EmployeeCard.module.css";

const EmployeeCard = ({ employee, schedule }) => {
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
    phone,
    email,
    employeeOfMonth,
  } = employee;

  const {
    fullYearsOfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  } = schedule;

  //if (loading) return <LoaderSpinner />;
  if (!employee)
    return (
      <LoaderSpinner /> && (
        <p lassName={styles.message}>Employee profile not found</p>
      )
    );

  return (
    <div className={styles.card} key={id}>
      <div
        className={`${getDepartmentClassName(department)} cardHeader`}
        style={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <div className={styles.bannerTitleWrapper}>
          <p className={styles.bannerTitleDpt}>{department}</p>

          <p className={styles.bannerTitleLoc}>{location}</p>
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
            <div className={styles.imgTitleWrapper}>
              <h3>{name}</h3>
              <div>
                <h4>{title}</h4>
                {status !== "Active" && status !== "Specified below" ? (
                  <p className={styles.statusTitle}>({status})</p>
                ) : (
                  <p style={{ color: "transparent", marginTop: "0.5rem" }}>
                    ({status})
                  </p>
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
              <h5>Current projects:</h5>
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
        <div className={styles.borderX}></div>
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
                  Schedule 6 months <br></br> probation review
                </p>
              </div>
            )}
            {scheduleRecognitionMeeting && (
              <div className={styles.scheduleWrapper}>
                <img
                  className={`${styles.scheduleIcon} ${styles.award}`}
                  src={awardBadgeIcon}
                  alt="Award badge icon"
                />
                <p className={styles.scheduleText}>
                  Schedule recognition meeting<br></br> ({fullYearsOfEmployment}{" "}
                  years of employment)
                </p>
              </div>
            )}
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={() =>
                navigate(`/employees/${employee.id}`, {
                  state: { editMode: false },
                })
              }
            >
              View Profile
            </button>
            <button
              type="button"
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
