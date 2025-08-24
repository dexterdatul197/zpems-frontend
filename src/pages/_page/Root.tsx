// @ts-nocheck
import { HeaderPortal } from "@/pages/_page/HeaderPortal";
import { useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";

export const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useRouteLoaderData("root");

  useEffect(() => {
    if (
      authUser.role === "vendor" &&
      !location.pathname.startsWith("/vendor-portal")
    ) {
      navigate("/vendor-portal");
    } else if (
      (authUser.role === "admin" || authUser.role === "user") &&
      !location.pathname.startsWith("/admin")
    ) {
      navigate("/admin");
    }
  }, [authUser]);

  return <Outlet />;
};
