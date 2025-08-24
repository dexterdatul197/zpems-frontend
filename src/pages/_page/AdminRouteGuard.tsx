// @ts-nocheck
import { Navigate, useRouteLoaderData } from "react-router-dom";

const AdminRouteGuard: React.FC = ({ children }) => {
  const { authUser } = useRouteLoaderData("root");

  if (authUser.role !== "admin") {
    console.log("not authorized");
    return <div className="p-20 text-center">Not authorized</div>; // Redirect to a different page if the user is not an admin
  }

  return <>{children}</>; // Render the children if the user is an admin
};

export default AdminRouteGuard;
