//@ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/sap/vendors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const getVendors = async (queryParams = {}) => {
  const response = await apiInstance().get(`/?${qs.stringify(queryParams)}`);
  return response.data;
};

export const createVendor = async (data) => {
  const response = await apiInstance().post("/", data);
  return response.data;
};

export const updateVendor = async (id, data) => {
  const response = await apiInstance().put(`/${id}`, data);
  return response.data;
};

export const updatePayment = async (id, data) => {
  const response = await apiInstance().patch(`/${id}`, data);
  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await apiInstance().delete(`/${id}`);
  return response.data;
};

export const getVendorByUserId = async (userId) => {
  const response = await apiInstance().get(`/user/${userId}`);
  return response.data;
};
