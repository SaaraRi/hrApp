const normalizeEmployee = (emp) => ({
  ...emp,
  skills: Array.isArray(emp.skills)
    ? emp.skills
    : typeof emp.skills === "string"
    ? emp.skills.split(",").map((s) => s.trim())
    : [],
  currentProjects: Array.isArray(emp.currentProjects)
    ? emp.currentProjects
    : typeof emp.currentProjects === "string"
    ? emp.currentProjects.split(",").map((p) => p.trim())
    : [],
});

setEmployeesData(response.data.map(normalizeEmployee));


In your useAxios hook or EmployeesList, you can sanitize the incoming data when you setEmployeesData:

Fix 2: Normalize in EmployeeCard at the top
Add this early in the component:

jsx
Copy
Edit
employee.skills = Array.isArray(employee.skills)
  ? employee.skills
  : typeof employee.skills === "string"
  ? employee.skills.split(",").map((s) => s.trim())
  : [];

employee.currentProjects = Array.isArray(employee.currentProjects)
  ? employee.currentProjects
  : typeof employee.currentProjects === "string"
  ? employee.currentProjects.split(",").map((p) => p.trim())
  : [];

  <p className={`todo-status ${completed ? "" : "incomplete"}`}>
            {completed ? "Completed ✅" : "Not completed ❌"} </p>


  value={Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills}

  value={Array.isArray(updatedData.skills) ? updatedData.skills.join(", ") : updatedData.skills}

  (employee.skills || []).map((skill) => (
    <span key={skill}>{skill} </span>
  ))


  value={newData.skills.join(', ')}
  onChange={(e) => setNewData({ ...newData, skills: e.target.value.split(',').map(skills => skills.trim()) })}

  <p>{skills.map(skill => skill.trim()).join(', ')}</p>


  <button
  onClick={() => navigate(`/employees/${id}`)}
  //text={"See full profile"}
>



  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedData({
      ...employee,
      skills: Array.isArray(employee.skills) ? employee.skills.join(", ") : employee.skills,
      currentProjects: Array.isArray(employee.currentProjects) ? employee.currentProjects.join(", ") : employee.currentProjects,
    });
  };



  const addEmployeeHandler = (newEmployee) => {
    setPersonsData((prev) => [
    ...prev,
    { ...newEmployee, id: Date.now()}
    ]);  
     };

  const updatedEmployee = {
    ...employee,
    employeeOfMonth: !employeeOfMonth,
  };
  But employee might be stale if the data changed in the meantime.
  
  ✅ Safer alternative:
  
  js
  Copy
  Edit
  const updatedEmployee = {
    ...updatedData,
    employeeOfMonth: !employeeOfMonth,
  };





  const flashMessage = (type, message) => {
    type === "success"
      ? setSuccessMessage(message)
      : setErrorMessage(message);
  
    setTimeout(() => {
      type === "success" ? setSuccessMessage("") : setErrorMessage("");
    }, 3000);
  };
  Then replace usages like:
  
  js
  Copy
  Edit
  flashMessage("success", "Profile updated successfully");
  flashMessage("error", "Failed to update employee");






  const updatedEmployee = {
    ...updatedData,
    salary: parseFloat(updatedData.salary),
    skills: typeof updatedData.skills === "string"
      ? updatedData.skills.split(",").map((s) => s.trim())
      : updatedData.skills,
    currentProjects: typeof updatedData.currentProjects === "string"
      ? updatedData.currentProjects.split(",").map((p) => p.trim())
      : updatedData.currentProjects,
  };


  const skillsArray = Array.isArray(employee.skills)
  ? employee.skills
  : typeof employee.skills === "string"
  ? employee.skills.split(",").map((s) => s.trim())
  : [];
Then render like:

jsx
Copy
Edit
{skillsArray.map((skill) => (
  <span key={skill}>{skill} </span>
))}
You can do the same with employee.currentProjects.

🔍 To Fix the Root of the Problem
In your update function, when you're handling form submission, make sure to turn the input values (which are strings) back into arrays:

jsx
Copy
Edit
const updatedEmployee = {
  ...updatedData,
  salary: parseFloat(updatedData.salary),
  skills: typeof updatedData.skills === "string"
    ? updatedData.skills.split(",").map((s) => s.trim())
    : updatedData.skills,
  currentProjects: typeof updatedData.currentProjects === "string"
    ? updatedData.currentProjects.split(",").map((p) => p.trim())
    : updatedData.currentProjects,
};
That way the backend (or your frontend) will always receive consistent data.

Would you like help writing a sanitizeEmployeeData() function to clean up these fields automatically?








You said:
import { useState, useEffect } from "react";
import EmployeeCard from "../../components/EmployeeCard/EmployeeCard";
import useAxios from "../../hooks/useAxios";
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
  const [updatedData, setUpdatedData] = useState([]);
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

  const filteredEmployees = (employees || []).filter((employee) => {
    //const filteredEmployees = employees.filter((employee) => {
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
  //if (!employees || !employees.length)
  //if (employees.length === 0)
  if (!employees) return <p className="message">No employee data available.</p>;

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

export default EmployeesList;       ncaught TypeError: Cannot read properties of null (reading 'length')
    at EmployeesList.jsx:39:19
    at react-stack-bottom-frame (react-dom_client.js?v=a6192343:17478:20)
    at runWithFiberInDEV (react-dom_client.js?v=a6192343:1485:72)
    at commitHookEffectListMount (react-dom_client.js?v=a6192343:8460:122)
    at commitHookPassiveMountEffects (react-dom_client.js?v=a6192343:8518:60)
    at reconnectPassiveEffects (react-dom_client.js?v=a6192343:10016:13)
    at recursivelyTraverseReconnectPassiveEffects (react-dom_client.js?v=a6192343:9995:11)
    at reconnectPassiveEffects (react-dom_client.js?v=a6192343:10054:13)
    at recursivelyTraverseReconnectPassiveEffects (react-dom_client.js?v=a6192343:9995:11)
    at reconnectPassiveEffects (react-dom_client.js?v=a6192343:10009:13)


ChatGPT said:
The error you're seeing:

javascript
Copy
Edit
Uncaught TypeError: Cannot read properties of null (reading 'length')
    at EmployeesList.jsx:39:19
is happening here in your code:

jsx
Copy
Edit
useEffect(() => {
  if (employees.length) {
    simulateLoading(() => setLoading(false));
  }
}, [employees]);
This happens when employees is null or undefined, and you're trying to access .length on it. Even though you do a check later (if (!employees) return ...), this useEffect runs before that return.

✅ Fix
Add a null check before trying to access .length:

js
Copy
Edit
useEffect(() => {
  if (employees && employees.length) {
    simulateLoading(() => setLoading(false));
  }
}, [employees]);
🧠 Bonus Tips:
Initial loading state:
You're setting loading to false by default, but it should start as true if you're loading data:

js
Copy
Edit
const [loading, setLoading] = useState(true);
Simplify simulateLoading logic:
You might even consider making simulateLoading a Promise if you ever move to async/await style.

Cleaner fallback UI:
You check !employees, but a better approach might be:

js
Copy
Edit
if (!employees || employees.length === 0) {
  return <p className="message">No employee data available.</p>;
}
Let me know if you want help rewriting any part of this component to make it more robust or clean!







You said:
import { useState } from "react";
import axios from "axios";

const useAxios = (url) => {
  const [employeesData, setEmployeesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function read() {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setEmployeesData(response.data);
      // return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function create(newEmployee) {
    setLoading(true);
    try {
      await axios.post(url, newEmployee).then((response) => {
        setEmployeesData((prev) => [...prev, response.data]);
      });
      // return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function update(id, updatedEmployee) {
    setLoading(true);
    try {
      const response = await axios.patch(url, updatedEmployee); // remove /${id}
      //setEmployeesData(response.data); // assuming this is a single object
      setEmployeesData((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /*try {
        await.axios.patch(url, updatedFields) 
      .then((response) => {
        setEmployeesData((prev) =>
          prev.map((employee) =>
            employee.id === id ? response.data : employee
          )
        );
      });
      //return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }*/

  async function remove(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.delete(url); // remove /${id}
      setEmployeesData(null); // clear the local state
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  /*
        setLoading(true);
    try {
      await axios.delete(${url}/${id}).then(() => {
        setEmployeesData((prev) =>
          prev.filter((employee) => employee.id !== id)
        );
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }*/

  return {
    employeesData,
    setEmployeesData,
    loading,
    setLoading,
    error,
    create,
    read,
    update,
    remove,
  };
};

export default useAxios;     EmployeesList.jsx:48 Uncaught TypeError: Cannot read properties of null (reading 'filter')
    at EmployeesList (EmployeesList.jsx:48:39)
    at react-stack-bottom-frame (react-dom_client.js?v=b47d992e:17424:20)
    at renderWithHooks (react-dom_client.js?v=b47d992e:4206:24)
    at updateFunctionComponent (react-dom_client.js?v=b47d992e:6619:21)
    at beginWork (react-dom_client.js?v=b47d992e:7654:20)
    at runWithFiberInDEV (react-dom_client.js?v=b47d992e:1485:72)
    at performUnitOfWork (react-dom_client.js?v=b47d992e:10868:98)
    at workLoopSync (react-dom_client.js?v=b47d992e:10728:43)
    at renderRootSync (react-dom_client.js?v=b47d992e:10711:13)
    at performWorkOnRoot (react-dom_client.js?v=b47d992e:10359:46)


ChatGPT said:
The error:

javascript
Copy
Edit
Uncaught TypeError: Cannot read properties of null (reading 'filter')
is occurring because employeesData is initially set to null in your useAxios hook:

js
Copy
Edit
const [employeesData, setEmployeesData] = useState(null);
Then, in EmployeesList.jsx, you're doing:

js
Copy
Edit
const filteredEmployees = (employees || []).filter((employee) => {
  ...
});
But from the error stack trace, it seems like the code at line 48 is trying to access .filter on employees, and somehow employees is still null, meaning this fallback isn't protecting it properly.

✅ Fix
Change the initial state in the custom hook to an empty array:

js
Copy
Edit
const [employeesData, setEmployeesData] = useState([]); // instead of null
This ensures that employeesData is always an array, even before any data is fetched — so .filter() will never fail.

🔁 Optional: Defensive Coding in Component
Although the change above will solve the issue, it’s still good practice to defensively code in the component:

js
Copy
Edit
const filteredEmployees = Array.isArray(employees) ? employees.filter((employee) => {
  ...
}) : [];
But honestly, if you're ensuring employeesData is always an array in the hook, you won’t need this extra check.

✅ Also Fix These in useAxios
Fix .patch() and .delete() URLs – Right now you have:

js
Copy
Edit
await axios.patch(url, updatedEmployee); // ❌ wrong
await axios.delete(url); // ❌ wrong
Should be:

js
Copy
Edit
await axios.patch(`${url}/${id}`, updatedEmployee); // ✅ correct
await axios.delete(`${url}/${id}`); // ✅ correct
Update employee data correctly in update() – Currently:

js
Copy
Edit
setEmployeesData((prev) => [...prev, response.data]); // ❌ will duplicate
Should be:

js
Copy
Edit
setEmployeesData((prev) =>
  prev.map((employee) =>
    employee.id === id ? response.data : employee
  )
); // ✅ replaces only updated employee
Same for remove() – Currently:

js
Copy
Edit
setEmployeesData(null); // ❌ leads to the same filter crash
Should be:

js
Copy
Edit
setEmployeesData((prev) =>
  prev.filter((employee) => employee.id !== id)
); // ✅ removes employee safely
Would you like me to paste a cleaned-up version of the useAxios hook with all those fixes?




const skillsArray = Array.isArray(employee.skills)
  ? employee.skills
  : typeof employee.skills === "string"
  ? employee.skills.split(",").map((s) => s.trim())
  : [];
Then render like:

jsx
Copy
Edit
{skillsArray.map((skill) => (
  <span key={skill}>{skill} </span>
))}


const updatedEmployee = {
    ...updatedData,
    salary: parseFloat(updatedData.salary),
    skills: typeof updatedData.skills === "string"
      ? updatedData.skills.split(",").map((s) => s.trim())
      : updatedData.skills,
    currentProjects: typeof updatedData.currentProjects === "string"
      ? updatedData.currentProjects.split(",").map((p) => p.trim())
      : updatedData.currentProjects,
  };





