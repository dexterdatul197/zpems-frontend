//@ts-nocheck

import { redirect } from "react-router-dom";
import { login as apiLogin, register as apiRegister } from "@/api/auth";
import { getProfile } from "@/api/users";

const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? true : false;
};

export async function requireAuth() {
  if (!isAuthenticated()) {
    localStorage.removeItem("accessToken");
    throw redirect("/auth/login");
  }
}

export async function requireAnon() {
  const authUser = await checkAuthUser();
  if (authUser) {
    throw redirect("/");
  }
  // if (isAuthenticated()) {
  //   throw redirect("/");
  // }
}

export async function login({ email, password }) {
  const data = await apiLogin({ email, password });
  localStorage.setItem("accessToken", data.token.accessToken);
}

export async function register({ name, email, password }) {
  const data = await apiRegister({ name, email, password });
  localStorage.setItem("accessToken", data.token.accessToken);
}

export async function logout() {
  localStorage.removeItem("accessToken");
}

export async function checkAuthUser() {
  try {
    const profile = await getProfile();
    return profile;
  } catch (e) {
    if (e.code === "ERR_BAD_REQUEST") {
      localStorage.removeItem("accessToken");
    }
    return null;
  }
}
