//@ts-nocheck
import axios from "axios";
import qs from "qs";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/clockify/line-timesheets",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const getLineTimesheets = async (queryParams = {}) => {
  const response = await apiInstance().get(`/?${qs.stringify(queryParams)}`);
  return response.data;
};

export const createLineTimesheet = async (lineTimesheetData) => {
  const response = await apiInstance().post("/", lineTimesheetData);
  return response.data;
};

export const updateLineTimesheet = async (
  lineTimesheetId,
  lineTimesheetData
) => {
  const response = await apiInstance().patch(
    `/${lineTimesheetId}`,
    lineTimesheetData
  );
  return response.data;
};

export const deleteLineTimesheet = async (lineTimesheetId) => {
  const response = await apiInstance().delete(`/${lineTimesheetId}`);
  return response.data;
};

export const updateLineTimesheetTimeEntry = async (
  lineTimesheetId,
  timeEntryData
) => {
  const response = await apiInstance().post(
    `/${lineTimesheetId}/time-entries`,
    timeEntryData
  );
  return response.data;
};

export const submitTimeEntries = async (queryParams = {}) => {
  const response = await apiInstance().post(
    `/submit-time-entries?${qs.stringify(queryParams)}`
  );
  return response.data;
};
