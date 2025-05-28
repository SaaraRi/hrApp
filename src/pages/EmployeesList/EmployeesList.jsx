import { useState, useEffect } from "react";
import EmployeeCard from "../../components/EmployeeCard/EmployeeCard";
import useAxios from "../../aaaaaa/useAxiosvika";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import "./EmployeesList.css";

const EmployeesList = () => {
  const {
    employeesData: employees,
    update,
    read,
    //loading,
    error,
  } = useAxios("http://localhost:3005/employees");

  useEffect(() => {
    read();
  }, []);

  const [loading, setLoading] = useState(false);
  //const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState(employees);
  //const [updatedData, setUpdatedData] = useState(null);
  //const [employeeOfMonth, setEmployeeOfMonth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showLocationHelsinki, setShowLocationHelsinki] = useState(false);
  const [showLocationEspoo, setShowLocationEspoo] = useState(false);
  const [showLocationTampere, setShowLocationTampere] = useState(false);

  const simulateLoading = (callback) => {
    setTimeout(callback, 1500);
  };

  useEffect(() => {
    if (employees.length) {
      simulateLoading(() => setLoading(false));
    }
  }, [employees]);

  const searchHandle = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchTerm = searchValue.toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm) ||
      employee.title.toLowerCase().includes(searchTerm) ||
      employee.department.toLowerCase().includes(searchTerm) ||
      employee.location.toLowerCase().includes(searchTerm) ||
      employee.skills
        .map((skill) => skill.trim().toLowerCase())
        .join(", ")
        .includes(searchTerm) ||
      employee.currentProjects
        .map((project) => project.trim().toLowerCase())
        .join(", ")
        .includes(searchTerm) ||
      employee.status.toLowerCase().includes(searchTerm) ||
      employee.manager.toLowerCase().includes(searchTerm) ||
      employee.contractType.toLowerCase().includes(searchTerm);

    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;

    const matchesLocation =
      (!showLocationHelsinki && !showLocationEspoo && !showLocationTampere) ||
      (showLocationHelsinki && employee.location === "Helsinki") ||
      (showLocationEspoo && employee.location === "Espoo") ||
      (showLocationTampere && employee.location === "Tampere");

    return matchesSearch && matchesDepartment && matchesLocation;
  });

  if (error) return <p className="message">Error: {error}</p>;
  if (loading) return <LoaderSpinner />;
  if (!employees.length)
    return <p className="message">No employee data available.</p>;

  return (
    <>
      <h1>Employees Dashboard</h1>
      {loading ? (
        <LoaderSpinner />
      ) : (
        <>
          <div>
            <label htmlFor="search">Search for employee:</label>
            <input
              type="text"
              id="search"
              name="search"
              value={searchValue}
              onChange={searchHandle}
              placeholder="name, title, skills, projects, manager etc., status, contract type, department, location"
            />
          </div>
          <div>
            <label>Filter by department:</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="IT">IT</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Analytics">Analytics</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Human resources">Human resources</option>
            </select>
          </div>
          <div>
            <p>Select location:</p>
            <div>
              <input
                type="checkbox"
                id="helsinki"
                checked={showLocationHelsinki}
                onChange={() => setShowLocationHelsinki((prev) => !prev)}
              />
              <label htmlFor="helsinki">Helsinki</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="espoo"
                checked={showLocationEspoo}
                onChange={() => setShowLocationEspoo((prev) => !prev)}
              />
              <label htmlFor="espoo">Espoo</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="tampere"
                checked={showLocationTampere}
                onChange={() => setShowLocationTampere((prev) => !prev)}
              />
              <label htmlFor="tampere">Tampere</label>
            </div>
          </div>
          <div className="employeesList">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  {...employee}
                  onEditData={update}
                />
              ))
            ) : (
              <p>No match found, try another search.</p>
            )}
          </div>
          <button
            type="button"
            className="backToTopButton"
            onClick={() => {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }}
          >
            Back to top
          </button>
        </>
      )}
    </>
  );
};

export default EmployeesList;
