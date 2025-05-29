//import { useState } from "react";
import { useNavigate } from "react-router";
//import { Link } from "react-router";
import "./EmployeeCard.css";
import badgeImage from "../../assets/images/pngwing.com.png";
import useEmploymentTime from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
//import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";

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
        className={`${getDepartmentClassName(department)}`}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p className="dpt">
          {department}, {location}{" "}
        </p>
      </div>
      <img
        src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${name}${title}`}
        className="cardImg"
        alt={name}
      />

      {employeeOfMonth && (
        <img
          src={badgeImage}
          className="badgeImg"
          alt="Employee of the Month -badge"
        />
      )}

      <p>{name}</p>
      {status !== "active" && status !== "other" && (
        <p style={{ fontStyle: "italic", fontWeight: "bold" }}>({status})</p>
      )}
      <p>{title}</p>

      <p>
        <strong>Skills:</strong> {skills.join(", ")}
      </p>
      <p>
        <strong>Projects:</strong> {currentProjects.join(", ")}
      </p>

      <p>Contact:</p>
      <p>Phone: {phone}</p>
      <p>Email: {email}</p>

      <div>
        <button
          onClick={() =>
            navigate(`/employees/${employee.id}`, {
              state: { editMode: false },
            })
          }
        >
          View Full Profile
        </button>
        <button
          onClick={() =>
            navigate(`/employees/${employee.id}`, { state: { editMode: true } })
          }
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
