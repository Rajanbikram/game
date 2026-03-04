import { useState } from "react";
import { apiRequest } from "../utils/api";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callApi = async (method, endpoint, data = null) => {
    console.log(data);

    setLoading(true);
    setError("");
    try {
      const res = await apiRequest(method, endpoint, data);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  return { loading, error, callApi };
};
