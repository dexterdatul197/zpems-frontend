//@ts-nocheck
import axios from "axios";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/users",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

// export const updateProfile = async ({ name, email }) => {
//   const response = await apiInstance().post("/update-profile", { name, email });
//   return response.data;
// };

export const getProfile = async () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

  const response = await apiInstance().get("/profile");
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await apiInstance().patch(`/${userId}`, userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await apiInstance().get("/");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiInstance().post("/", userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiInstance().delete(`/${userId}`);
  return response.data;
};

export const syncUsers = async () => {
  const response = await apiInstance().post("/sync");
  return response.data;
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  const response = await apiInstance().post("/profile/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};
