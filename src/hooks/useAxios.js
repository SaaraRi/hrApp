import { useState } from "react";
import axios from "axios";

const useAxios = (url) => {
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function read() {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setEmployeesData(response.data);
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
      const response = await axios.post(url, newEmployee);
      setEmployeesData((prev) => [...prev, response.data]);
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
      const response = await axios.patch(`${url}/${id}`, updatedEmployee);
      setEmployeesData((prev) =>
        prev.map((employee) => (employee.id === id ? response.data : employee))
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.delete(`${url}/${id}`);
      setEmployeesData((prev) => prev.filter((employee) => employee.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

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

export default useAxios;
