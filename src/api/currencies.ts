//@ts-nocheck
import axios from "axios";

const apiInstance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/currencies",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

export const updateCurrency = async (currencyId, currencyData) => {
  const response = await apiInstance().patch(`/${currencyId}`, currencyData);
  return response.data;
};

export const getCurrencies = async () => {
  const response = await apiInstance().get("/");
  return response.data;
};

export const getActiveCurrencies = async () => {
  const currencies = await getCurrencies();
  return currencies.filter((currency) => currency.status === "active");
};

export const createCurrency = async (currencyData) => {
  const response = await apiInstance().post("/", currencyData);
  return response.data;
};

export const deleteCurrency = async (currencyId) => {
  const response = await apiInstance().delete(`/${currencyId}`);
  return response.data;
};

export const syncCurrencies = async () => {
  const response = await apiInstance().post("/sync");
  return response.data;
};
