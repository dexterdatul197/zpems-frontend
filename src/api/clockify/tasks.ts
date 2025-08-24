//@ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/clockify/tasks",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const getTasks = async (queryParams = {}) => {
  const response = await apiInstance().get(`/?${qs.stringify(queryParams)}`);
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await apiInstance().patch(`/${id}`, data);
  return response.data;
};

export const syncTasks = async () => {
  const response = await apiInstance().post("/sync");
  return response.data;
};
