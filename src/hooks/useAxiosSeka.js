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
      const response = await axios.patch(url, updatedEmployee);
      //setEmployeesData(response.data);

      setEmployeesData((prev) =>
        prev.map((employee) => (employee.id === id ? response.data : employee))
      );
      //setEmployeesData(response.data);
      //const response = await axios.patch(url, employee);
      //setEmployeesData(
      // (prev) => ({ ...prev, [name]: response.data })
      // prev.map((employee) => (employee.id === id ? response.data : employee))
      // );
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

  /*
  async function update(id, updatedFields) {
    setLoading(true);
    try {
      const response = await axios.patch(url, updatedFields); // remove /${id}
      setEmployeesData(response.data); // assuming this is a single object
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
    }

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
      await axios.delete(`${url}/${id}`).then(() => {
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

export default useAxios;
