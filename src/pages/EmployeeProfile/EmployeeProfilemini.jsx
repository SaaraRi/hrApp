import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useAxios from "../../aaaaaa/useAxiosvika";
import badgeImage from "./pngwing.com.png";
import { useEmploymentTime } from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    employeesData: employee,
    setEmployeesData,
    //loading,
    error,
    //success,
    read,
    update,
    remove,
  } = useAxios(`http://localhost:3005/employees/${id}`);
};


import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import badgeImage from "./pngwing.com.png";
import { useEmploymentTime } from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    employeesData: employee,
    read,
    update,
    remove,
    error,
  } = useAxios(`http://localhost:3005/employees/${id}`);

  const [updatedData, setUpdatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch employee on mount
  useEffect(() => {
    read();
  }, []);

  useEffect(() => {
    if (employee) {
      setUpdatedData({
        ...employee,
        skills: Array.isArray(employee.skills) ? employee.skills.join(", ") : "",
        currentProjects: Array.isArray(employee.currentProjects)
          ? employee.currentProjects.join(", ")
          : "",
      });
      setEmployeeOfMonth(employee.employeeOfMonth || false);
      setLoading(false);
    }
  }, [employee]);

  // Only call this hook once employee is loaded
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
        currentProjects: updatedData.currentProjects.split(",").map((p) => p.trim()),
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
    const confirmed = window.confirm("Are you sure you want to delete this profile?");
    if (confirmed) {
      await remove(id);
      setSuccessMessage("Profile deleted.");
      setTimeout(() => navigate("/employees"), 3000);
    }
  };

  const handleToggleEmployeeOfMonth = async () => {
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
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("Failed to update Employee of the Month status.");
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (loading || !updatedData) return <LoaderSpinner />;

  const isSaveDisabled =
    JSON.stringify({
      ...employee,
      skills: employee.skills.join(", "),
      currentProjects: employee.currentProjects.join(", "),
    }) === JSON.stringify(updatedData);
    
    
    import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useAxios from "../../hooks/useAxios";
import badgeImage from "./pngwing.com.png";
import { useEmploymentTime } from "../../hooks/useEmploymentTime";
import { getDepartmentClassName } from "../../utilities/styleUtils";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    employeesData: employee,
    //setEmployeesData,
    //loading,
    error,
    //success,
    read,
    update,
    remove,
  } = useAxios(`http://localhost:3005/employees/${id}`);

  /*
  useEffect(() => {
    if (employee) {
      setUpdatedData(employee);
      setEmployeeOfMonth(employee.employeeOfMonth || false);
    }
  }, [employee]);

  /* const [updatedData, setUpdatedData] = useState({
    ...employee,
    skills: employee.skills.join(", "),
    currentProjects: employee.currentProjects.join(", "),
  });
  const [updatedData, setUpdatedData] = useState({
    ...employee,
    skills: employee.skills.map((skill) => skill.trim()).join(", "),
    currentProjects: employee.currentProjects
      .map((project) => project.trim())
      .join(", "),
    salary: parseFloat(employee.salary),
  });*/

  const [updatedData, setUpdatedData] = useState(employee);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  //const [updatedData, setUpdatedData] = useState(employee);
  //const [updatedData, setUpdatedData] = useState(null);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    yearsOfEmployment,
    fullYearsOfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  } = employee?.startDate ? useEmploymentTime(employee.startDate) : {};

  /*
  const {
    yearsOfEmployment,
    fullYearsOfEmployment,
    scheduleProbationReview,
    scheduleRecognitionMeeting,
  } = useEmploymentTime(employee.startDate);

  const simulateLoading = (callback) => {
    setTimeout(callback, 1000);
  };
  /*
  useEffect(() => {
    if (employee.updatedData) {
      simulateLoading(() => setLoading(false));
    }
  }, [employee]);*/

  /*const [updatedData, setUpdatedData] = useState({
    ...employee,
    skills: employee.skills.join(", "),
    currentProjects: employee.currentProjects.join(", "),
  });*/

  useEffect(() => {
    read();
  }, []);

  useEffect(() => {
    if (employee) {
      setUpdatedData(employee);
      simulateLoading(() => setLoading(false));
      //setLoading(false);
      //setEmployeeOfMonth(employee.employeeOfMonth || false);
    }
  }, [employee]);

  /*useEffect(() => {
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
      setLoading(false);
    }
  }, [employee]);

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
*/

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated employee object
    const updatedEmployee = {
      ...updatedData,
      skills:
        typeof updatedData.skills === "string"
          ? updatedData.skills.split(",").map((skill) => skill.trim())
          : updatedData.skills, // In case it's already an array

      currentProjects:
        typeof updatedData.currentProjects === "string"
          ? updatedData.currentProjects
              .split(",")
              .map((project) => project.trim())
          : updatedData.currentProjects,

      salary: parseFloat(updatedData.salary),
    };

    try {
      setLoading(true);
      await update(id, updatedEmployee);
      setUpdatedData(updatedEmployee); // Update local state
      setIsEditing(false);
      setSuccessMessage("Employee profile updated successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Update failed:", error);
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
      salary: parseFloat(updatedData.salary),
    };

    const updatedEmployee = {
      ...updatedData,
      skills: updatedData.skills.split(",").map((skill) => skill.trim()),
      currentProjects: updatedData.currentProjects
        .split(",")
        .map((project) => project.trim()),
      salary: parseFloat(updatedData.salary),
    };

    /*
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    const updatedEmployee = {
      ...updatedData,
      skills: updatedData.skills.split(",").map((skill) => skill.trim()),
      currentProjects: updatedData.currentProjects
        .split(",")
        .map((project) => project.trim()),
      salary: parseFloat(updatedData.salary),
    };

    try {
      simulateLoading(() => setLoading(true));
      await update(id, updatedEmployee);
      setEmployeesData(updatedEmployee);
      setIsEditing(false);
      setSuccessMessage("Employee profile updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      simulateLoading(() => setLoading(false));
    } catch (error) {
      setErrorMessage("Failed to add employee profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      simulateLoading(() => setLoading(false));
    }
  };
*/
  const handleCancel = () => {
    setUpdatedData(employee);
    setIsEditing(false);
  };

  const isSaveDisabled =
    !updatedData || JSON.stringify(updatedData) === JSON.stringify(employee);

  const handleToggleEmployeeOfMonth = async () => {
    const updatedEmployee = {
      ...updatedData,
      employeeOfMonth: !employeeOfMonth,
    };

    try {
      await update(id, updatedEmployee);
      setUpdatedData(updatedEmployee);
      setEmployeeOfMonth(updatedEmployee.employeeOfMonth);
      setSuccessMessage(
        updatedEmployee.employeeOfMonth
          ? "Selected as Employee of the Month!"
          : "Employee of the Month status removed."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to update Employee of the Month status.");
      setTimeout(() => setErrorMessage(""), 3000);
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (confirmed) {
      remove(id);
      setSuccessMessage("Profile has been successfully deleted.");
      setTimeout(() => navigate("/employees"), 3000);
      setLoading(false);
    }
  };

  
  if (error) return <p>Error: {error}</p>;
  if (!employee) return <p>Employee profile not found.</p>;
  if (loading) return <LoaderSpinner />;