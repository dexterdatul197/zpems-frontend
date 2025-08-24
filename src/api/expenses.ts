// @ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/expenses",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

// getExpenses
export const getExpenses = async (queryParams = {}) => {
  const response = await apiInstance().get(`/?${qs.stringify(queryParams)}`);
  return response.data;
};

// get ExpensesGroup
export const getExpensesGroup = async (queryParams = {}) => {
  const response = await apiInstance().get(
    `/group?${qs.stringify(queryParams)}`
  );
  return response.data;
};

// getExpense
export const getExpense = async (expenseId) => {
  const response = await apiInstance().get(`/${expenseId}`);
  return response.data;
};

// createExpense
export const createExpense = async (expenseData) => {
  const response = await apiInstance().post("/", expenseData);
  return response.data;
};

// updateExpense
export const updateExpense = async (expenseId, expenseData) => {
  const response = await apiInstance().patch(`/${expenseId}`, expenseData);
  return response.data;
};

// deleteExpense
export const deleteExpense = async (expenseId) => {
  const response = await apiInstance().delete(`/${expenseId}`);
  return response.data;
};

export const scanReceipt = async (receiptData) => {
  const response = await apiInstance().post(`/scan-receipt`, receiptData);
  return response.data;
};

export const importExpensesFromCSV = async (formData) => {
  const response = await apiInstance().post(`/import-from-csv`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
