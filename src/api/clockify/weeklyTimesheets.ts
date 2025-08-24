//@ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/clockify/weekly-timesheets",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const getWeeklyTimesheets = async (queryParams = {}) => {
  const response = await apiInstance().get(`/?${qs.stringify(queryParams)}`);
  return response.data;
};
