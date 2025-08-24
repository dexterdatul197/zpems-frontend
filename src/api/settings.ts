// @ts-nocheck
import axios from "axios";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/settings",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const getSettings = async () => {
  const response = await apiInstance().get("/");
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await apiInstance().patch(`/`, settingsData);
  return response.data;
};

export const testNetsuiteConnection = async (settingsData) => {
  const response = await apiInstance().post(
    `/test-netsuite-connection`,
    settingsData
  );
  return response.data;
};

export const testOpenAIConnection = async (settingsData) => {
  const response = await apiInstance().post(
    `/test-openai-connection`,
    settingsData
  );
  return response.data;
};
