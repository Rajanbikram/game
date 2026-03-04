import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return { register, login, logout, loading, error };
};