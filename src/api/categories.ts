//@ts-nocheck
import axios from "axios";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/categories",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const updateCategory = async (categoryId, categoryData) => {
  const response = await apiInstance().patch(`/${categoryId}`, categoryData);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiInstance().get("/");
  return response.data;
};

export const getActiveCategories = async () => {
  const categories = await getCategories();
  return categories.filter((category) => category.status === "active");
};

export const createCategory = async (categoryData) => {
  const response = await apiInstance().post("/", categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await apiInstance().delete(`/${categoryId}`);
  return response.data;
};

export const syncCategories = async () => {
  const response = await apiInstance().post("/sync");
  return response.data;
};
