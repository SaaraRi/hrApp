import { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import EmployeeCard from "../../components/EmployeeCard/EmployeeCard.jsx";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import styles from "./EmployeesList.module.css";

const EmployeesList = () => {
  const {
    employeesData: employees,
    read,
    error,
  } = useAxios("http://localhost:3007/employees");

  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showLocationHelsinki, setShowLocationHelsinki] = useState(false);
  const [showLocationEspoo, setShowLocationEspoo] = useState(false);
  const [showLocationTampere, setShowLocationTampere] = useState(false);

  useEffect(() => {
    read();
  }, []);

  const simulateLoading = (callback) => {
    setTimeout(callback, 1250);
  };

  useEffect(() => {
    if (employees && employees.length) {
      simulateLoading(() => setLoading(false));
    }
  }, [employees]);

  const searchHandle = (e) => {
    setSearchValue(e.target.value);
  };

  const searchTerm = searchValue.toLowerCase();

  const filteredEmployees = (employees || []).filter((employee) => {
    const matchesSearch =
      (employee.name || "").toLowerCase().includes(searchTerm) ||
      (employee.title || "").toLowerCase().includes(searchTerm) ||
      (employee.department || "").toLowerCase().includes(searchTerm) ||
      (employee.location || "").toLowerCase().includes(searchTerm) ||
      (employee.skills || [])
        .map((skill) => skill.trim().toLowerCase())
        .join(", ")
        .includes(searchTerm) ||
      (employee.currentProjects || [])
        .map((project) => project.trim().toLowerCase())
        .join(", ")
        .includes(searchTerm) ||
      (employee.status || "").toLowerCase().includes(searchTerm) ||
      (employee.manager || "").toLowerCase().includes(searchTerm) ||
      (employee.contractType || "").toLowerCase().includes(searchTerm);

    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;

    const matchesLocation =
      (!showLocationHelsinki && !showLocationEspoo && !showLocationTampere) ||
      (showLocationHelsinki && employee.location === "Helsinki") ||
      (showLocationEspoo && employee.location === "Espoo") ||
      (showLocationTampere && employee.location === "Tampere");

    return matchesSearch && matchesDepartment && matchesLocation;
  });

  if (error) return <p className={styles.message}>Error: {error}</p>;
  if (loading) return <LoaderSpinner />;
  if (!employees || employees.length === 0) {
    return <p className={styles.message}>No employee data available.</p>;
  }

  return (
    <div className={styles.listContainer}>
      <h1>Employees Dashboard</h1>
      {loading ? (
        <LoaderSpinner />
      ) : (
        <>
          <div className={styles.searchContainer}>
            <h2>Search for employee:</h2>
            <div className={styles.searchType}>
              <input
                type="text"
                id="search"
                className={styles.searchInput}
                value={searchValue}
                onChange={searchHandle}
                placeholder="Name, title, skills, projects, manager, etc. status, contract type, department, location"
              />
            </div>
            <div className={styles.searchType}>
              <select
                className={styles.searchSelect}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">Filter by Department</option>
                <option value="all">All</option>
                {[
                  "Design",
                  "Development",
                  "Product",
                  "Finance",
                  "Marketing",
                  "Sales",
                  "Analytics",
                  "IT",
                  "Customer Relations",
                  "Legal",
                  "Human Resources",
                ].map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <div className={`${styles.searchType} ${styles.checkboxContainer}`}>
              <div className={styles.checkboxWrapper}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  id="Helsinki"
                  checked={showLocationHelsinki}
                  onChange={() => setShowLocationHelsinki((prev) => !prev)}
                />
                <label htmlFor="Helsinki" className={styles.checkboxLabel}>
                  Helsinki
                </label>
              </div>
              <div className={styles.checkboxWrapper}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  id="Espoo"
                  checked={showLocationEspoo}
                  onChange={() => setShowLocationEspoo((prev) => !prev)}
                />
                <label htmlFor="Espoo" className={styles.label}>
                  Espoo
                </label>
              </div>
              <div className={styles.checkboxWrapper}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  id="Tampere"
                  checked={showLocationTampere}
                  onChange={() => setShowLocationTampere((prev) => !prev)}
                />
                <label htmlFor="Tampere" className={styles.label}>
                  Tampere
                </label>
              </div>
            </div>
          </div>
          <div className={styles.employeesList}>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))
            ) : (
              <p>No match found, try another search.</p>
            )}
          </div>
          <button
            type="button"
            className={styles.backToTopButton}
            onClick={() => {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
            }}
          >
            Back to top
          </button>
        </>
      )}
    </div>
  );
};

export default EmployeesList;
