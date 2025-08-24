//@ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/clockify/clients",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const getClients = async (queryParams = {}) => {
  const response = await apiInstance().get(`/?${qs.stringify(queryParams)}`);
  return response.data;
};

export const getClientProjects = async (queryParams = {}) => {
  const response = await apiInstance().get(
    `/projects?${qs.stringify(queryParams)}`
  );
  return response.data;
};

export const syncClients = async () => {
  const response = await apiInstance().post("/sync");
  return response.data;
};
