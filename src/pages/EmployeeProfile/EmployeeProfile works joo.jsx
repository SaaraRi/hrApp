import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useAxios from "../../aaaaaa/useAxiosvika";
import badgeImage from "./pngwing.com.png";
import { useEmploymentTime } from "../../hooks/useEmploymentTime";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    employeesData: employee,
    setEmployeesData,
    read,
    loading,
    error,
    update,
    remove,
  } = useAxios(`http://localhost:3005/employees/${id}`);

  const {
    yearsOfEmployment,
    fullYearsOIfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  } = useEmploymentTime(startDate);

  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState(null);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  //  const { data, loading, read } = useAxiosRequest(
  //    `http://localhost:3001/persons/${id}`
  //  );

  useEffect(() => {
    read();
  }, []);

  /*
  useEffect(() => {
    getOne(id);
  }, [id]);*/

  useEffect(() => {
    if (employee) {
      setNewData(employee);
      setEmployeeOfMonth(employee.employeeOfMonth || false);
    }
  }, [employee]);

  const handleSave = () => {
    update(id, newData);
    setEmployeesData(newData);
    setIsEditing(false);
    setEmployeeOfMonth(newData.employeeOfMonth || false);
    //setNewData(newData);
    setSaveMessage("Profile updated");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleCancel = () => {
    setNewData(employee);
    setIsEditing(false);
  };

  const isSaveDisabled =
    !newData || JSON.stringify(newData) === JSON.stringify(employee);

  const handleToggleEmployeeOfMonth = () => {
    const updatedEmployee = {
      ...employee,
      employeeOfMonth: !employee.employeeOfMonth,
    };
    setEmployeeOfMonth(updatedEmployee.employeeOfMonth);
    update(id, updatedEmployee);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (confirmed) {
      remove(id);
      setDeleteMessage("Profile has been successfully deleted.");
      setTimeout(() => {
        navigate("/employees");
      }, 2000);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!employee) return <p>Employee profile not found.</p>;
  if (loading) return <p>Loading...</p>;

  //  if (!data) return <p>No data available.</p>;

  return (
    <div className="profilePage" key={id}>
      {saveMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{saveMessage}</p>
      )}
      {deleteMessage && (
        <p style={{ color: "green", fontWeight: "bold" }}>{deleteMessage}</p>
      )}
      <h1>{employee.name}</h1>
      <img
        src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${employee.name}${employee.title}`}
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
          <input
            type="text"
            value={newData.name}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
            placeholder="Name"
          />
          <div className="add-input">
            <label htmlFor="status" className="white-font">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={newData.status}
              onChange={(e) =>
                setNewData({ ...newData, status: e.target.value })
              }
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="on vacation">On vacation</option>
              <option value="on parental leave">On parental leave</option>
              <option value="on study leave">On study leave</option>
              <option value="resigned">Resigned</option>
              <option value="retired">Retired</option>
              <option value="other">Other (specify below)</option>
            </select>
          </div>

          <input
            type="text"
            value={newData.title}
            onChange={(e) => setNewData({ ...newData, title: e.target.value })}
            placeholder="Title"
          />
          <select
            value={newData.department}
            onChange={(e) =>
              setNewData({ ...newData, department: e.target.value })
            }
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
            <option value="Human resources">Human Resources</option>
          </select>

          <div className="add-input">
            <p className="white-font">Location:</p>
            <label>
              <input
                type="radio"
                name="location"
                value="Helsinki"
                checked={newData.location === "Helsinki"}
                onChange={(e) =>
                  setNewData({ ...newData, location: e.target.value })
                }
              />
              Helsinki
            </label>
            <label>
              <input
                type="radio"
                name="location"
                value="Espoo"
                checked={newData.location === "Espoo"}
                onChange={(e) =>
                  setNewData({ ...newData, location: e.target.value })
                }
              />
              Espoo
            </label>
            <label>
              <input
                type="radio"
                name="location"
                value="Tampere"
                checked={newData.location === "Tampere"}
                onChange={(e) =>
                  setNewData({ ...newData, location: e.target.value })
                }
              />
              Tampere
            </label>
          </div>

          <input
            type="text"
            value={newData.skills.join(", ")}
            onChange={(e) =>
              setNewData({
                ...newData,
                skills: e.target.value.split(",").map((skill) => skill.trim()),
              })
            }
            placeholder="Skills"
          />

          <input
            type="text"
            value={newData.currentProjects.join(", ")}
            onChange={(e) =>
              setNewData({
                ...newData,
                currentProjects: e.target.value
                  .split(",")
                  .map((currentProject) => currentProject.trim()),
              })
            }
            placeholder="Current projects"
          />

          <div className="add-input">
            <label htmlFor="manager" className="white-font">
              Manager:
            </label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={newData.manager}
              onChange={(e) =>
                setNewData({ ...newData, manager: e.target.value })
              }
            />
          </div>
          <div className="add-input">
            <label htmlFor="startDate" className="white-font">
              Start date:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newData.startDate}
              onChange={(e) =>
                setNewData({ ...newData, startDate: e.target.value })
              }
            />
          </div>
          <div className="add-input">
            <label htmlFor="contractType" className="white-font">
              Contract type:
            </label>
            <select
              id="contractType"
              name="contractType"
              value={newData.contractType}
              onChange={(e) =>
                setNewData({ ...newData, contractType: e.target.value })
              }
            >
              <option value="">Select contract type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time 50%">Part-time 50%</option>
              <option value="part-time 80%">Part-time 80%</option>
              <option value="contractual">Contractual</option>
              <option value="internship">Internship</option>
              <option value="other">Other (specify below)</option>
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
              value={newData.salary}
              onChange={(e) =>
                setNewData({ ...newData, salary: e.target.value })
              }
            />
          </div>
          <div className="add-input">
            <label htmlFor="vacationDaysAcc" className="white-font">
              Vacation days accumulated:
            </label>
            <input
              type="number"
              id="vacationDaysAcc"
              name="vacationDaysAcc"
              value={newData.vacationDaysAcc}
              onChange={(e) =>
                setNewData({ ...newData, vacationDaysAcc: e.target.value })
              }
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
              value={newData.email}
              onChange={(e) =>
                setNewData({ ...newData, email: e.target.value })
              }
              placeholder="Email"
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
              value={newData.phone}
              onChange={(e) =>
                setNewData({ ...newData, phone: e.target.value })
              }
            />
          </div>
          <div className="add-input">
            <label htmlFor="homeAddress" className="white-font">
              Home address:
            </label>
            <input
              type="text"
              id="homeAddress"
              name="homeAddress"
              value={newData.homeAddress}
              onChange={(e) =>
                setNewData({ ...newData, homeAddress: e.target.value })
              }
            />
          </div>
          <div className="add-input">
            <label htmlFor="dateOfBirth" className="white-font">
              Date of birth:
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={newData.dateOfBirth}
              onChange={(e) =>
                setNewData({ ...newData, dateOfBirth: e.target.value })
              }
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
              value={newData.education}
              onChange={(e) =>
                setNewData({ ...newData, education: e.target.value })
              }
            />
          </div>
          <div className="add-input">
            <label htmlFor="emergencyContact" className="white-font">
              Emergency contact:
            </label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={newData.emergencyContact}
              onChange={(e) =>
                setNewData({ ...newData, emergencyContact: e.target.value })
              }
            />
          </div>
          <div className="add-input">
            <label htmlFor="otherInfo">Other information:</label>
            <textarea
              id="otherInfo"
              name="otherInfo"
              rows="4"
              cols="50"
              value={newData.otherInfo}
              onChange={(e) =>
                setNewData({ ...newData, otherInfo: e.target.value })
              }
            ></textarea>
          </div>
        </>
      ) : (
        <>
          <p>
            <strong>Title:</strong> {employee.title}
          </p>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <p>
            <strong>Location:</strong> {employee.location}
          </p>
          <p>
            <strong>Current projects:</strong>
            {employee.currentProjects
              .map((currentProject) => currentProject.trim())
              .join(", ")}
          </p>
          <p>
            <strong>Skills:</strong>
            {employee.skills.map((skill) => skill.trim()).join(", ")}
          </p>
          <p>
            <strong>Manager:</strong> {employee.manager}
          </p>
          <p>
            <strong>Start date:</strong> {employee.startDate}
          </p>
          <p>
            <strong>Contract type:</strong> {employee.contractType}
          </p>
          <p>
            <strong>Status:</strong> {employee.status}
          </p>
          <p>
            <strong>Vacation days accumulated:</strong>{" "}
            {employee.vacationDaysAcc}
          </p>
          <p>
            <strong>Salary:</strong> {employee.salary}
          </p>
          <p>
            <strong>Phone:</strong> {employee.phone}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Home address:</strong> {employee.homeAddress}
          </p>
          <p>
            <strong>Date of Birth:</strong> {employee.dateOfBirth}
          </p>
          <p>
            <strong>Education:</strong> {employee.education}
          </p>
          <p>
            <strong>Emergency contact:</strong> {employee.emergencyContact}
          </p>
          <p>
            <strong>Other information:</strong> {employee.otherInfo}
          </p>
        </>
      )}

      <div>
        <button onClick={() => navigate(-1)}>Go Back</button>
        <Link to={"/employees"}>Back to list</Link>
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={isSaveDisabled}>
              Save details
            </button>
            <button onClick={handleCancel}>Cancel edit</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>

      <button onClick={handleToggleEmployeeOfMonth}>
        {employeeOfMonth
          ? 'Remove status "Employee of the Month"'
          : 'Add status "Employee of the Month"'}
      </button>
      <button
        onClick={handleDelete}
        style={{ color: "white", backgroundColor: "red", marginTop: "1rem" }}
      >
        Delete Profile
      </button>
    </div>
  );
};

export default EmployeeProfile;
