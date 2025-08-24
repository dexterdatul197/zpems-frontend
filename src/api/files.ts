// @ts-nocheck
import axios from "axios";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/files",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiInstance().post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
