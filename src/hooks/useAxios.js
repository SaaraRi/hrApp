import { useState } from "react";
import axios from "axios";

const useAxios = (url) => {
  const [employeesData, setEmployeesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const read = async (id = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/${id}`);
      setEmployeesData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const create = async (newEmployee) => {
    setLoading(true);
    try {
      const response = await axios.post(url, newEmployee);
      setEmployeesData((prev) =>
        Array.isArray(prev) ? [...prev, response.data] : [response.data]
      );
      return response.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id, updatedEmployee) => {
    setLoading(true);
    try {
      const response = await axios.patch(`${url}/${id}`, updatedEmployee);
      setEmployeesData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${url}/${id}`);
      setEmployeesData(employeesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
};

export default useAxios;
