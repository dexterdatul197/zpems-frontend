//@ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/clockify/time-entries",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const getTimeEntries = async (queryParams = {}) => {
  const response = await apiInstance().get(`/?${qs.stringify(queryParams)}`);
  return response.data;
};

export const getTimeReports = async (queryParams = {}) => {
  const response = await apiInstance().get(
    `/time-reports?${qs.stringify(queryParams)}`
  );
  return response.data;
};

export const createTimeEntry = async (data) => {
  const response = await apiInstance().post("/", data);
  return response.data;
};

export const updateTimeEntry = async (id, data) => {
  const response = await apiInstance().patch(`/${id}`, data);
  return response.data;
};

export const deleteTimeEntry = async (id) => {
  const response = await apiInstance().delete(`/${id}`);
  return response.data;
};

export const parseAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const response = await apiInstance().post("/parse-audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
