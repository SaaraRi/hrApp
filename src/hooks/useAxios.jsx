import { useEffect, useState } from "react";
import axios from "axios";

function useAxios(url) {
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ
  const read = () => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setEmployeesData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  };

  useEffect(() => {
    read();
  }, [url]);

  // CREATE
  const create = (newEmployee, callback) => {
    axios
      .post(url, newEmployee)
      .then((res) => {
        setEmployeesData((prev) => [...prev, res.data]);
        callback?.(res.data); // optional callback (e.g. redirect)
      })
      .catch((err) => setError(err.message || "Failed to add employee"));
  };

  // UPDATE
  const update = (id, updatedFields) => {
    axios
      .patch(`${url}/${id}`, updatedFields)
      .then((res) => {
        setEmployeesData((prev) =>
          prev.map((emp) => (emp.id === id ? res.data : emp))
        );
      })
      .catch((err) => setError(err.message || "Failed to update employee"));
  };

  // DELETE (if needed)
  const remove = (id) => {
    axios
      .delete(`${url}/${id}`)
      .then(() => {
        setEmployeesData((prev) => prev.filter((emp) => emp.id !== id));
      })
      .catch((err) => setError(err.message || "Failed to delete employee"));
  };

  return {
    employeesData,
    loading,
    error,
    read,
    create,
    update,
    remove,
  };
}

export default useAxios;





