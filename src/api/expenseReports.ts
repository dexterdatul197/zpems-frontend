// @ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/expense-reports",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

// getExpenseReports
export const getExpenseReports = async (query) => {
  const response = await apiInstance().get(`?${qs.stringify(query)}`);
  return response.data;
};

// getExpenseReport
export const getExpenseReport = async (expenseReportId) => {
  const response = await apiInstance().get(`/${expenseReportId}`);
  return response.data;
};

// createExpenseReport
export const createExpenseReport = async (expenseReportData) => {
  const response = await apiInstance().post("/", expenseReportData);
  return response.data;
};

// updateExpenseReport
export const updateExpenseReport = async (
  expenseReportId,
  expenseReportData
) => {
  const response = await apiInstance().patch(
    `/${expenseReportId}`,
    expenseReportData
  );
  return response.data;
};

// deleteExpenseReport
export const deleteExpenseReport = async (expenseReportId) => {
  const response = await apiInstance().delete(`/${expenseReportId}`);
  return response.data;
};

export const submitExpenseReport = async (expenseReportId) => {
  const response = await apiInstance().post(`/${expenseReportId}/submit`);
  return response.data;
};

export const importExpenseReportsFromCSV = async (formData) => {
  const response = await apiInstance().post(`/import-from-csv`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
