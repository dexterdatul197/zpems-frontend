//@ts-nocheck
import axios from "axios";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/auth",
    headers: {},
  });

export const login = async (credentials) => {
  const response = await apiInstance().post("/login", credentials);
  return response.data;
};

export const register = async (userInfo) => {
  const response = await apiInstance().post("/register", userInfo);
  return response.data;
};

export const acceptInvitation = async ({
  invitationId,
  token,
  password,
  confirmPassword,
}) => {
  const response = await apiInstance().post(
    `invitations/${invitationId}/accept?token=${token}`,
    {
      password,
      confirmPassword,
    }
  );
  return response.data;
};
