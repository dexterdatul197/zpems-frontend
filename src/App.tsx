//@ts-nocheck
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";

import { Root } from "@/pages/_page/Root";

import { Root as AdminRoot } from "@/pages/admin/_page/Root";
import { Login } from "@/pages/auth/login/_page/Login";
import { Register } from "@/pages/auth/register/_page/Register";
import { Invitation } from "@/pages/auth/invitation/_page/Invitation";

import { Home } from "@/pages/admin/expensify/home/_page/Home";
import { ExpenseList } from "@/pages/admin/expensify/expenses/_page/ExpenseList";
import { ExpenseReportList } from "@/pages/admin/expensify/reports/_page/ExpenseReportList";

import { Track as ClockifyTrack } from "@/pages/admin/clockify/track/_page/Track";
import { TimeEntryList as ClockifyTimeEntryList } from "@/pages/admin/clockify/time-entries/_page/TimeEntryList";
import { WeeklyTimesheetList as ClockifyWeeklyTimesheetList } from "@/pages/admin/clockify/weekly-timesheets/_page/WeeklyTimesheetList";
import { Reports as ClockifyReports } from "@/pages/admin/clockify/reports/_page/Reports";

import { Profile } from "@/pages/admin/profile/_page/Profile";

import { requireAuth, requireAnon, logout, checkAuthUser } from "@/utils/auth";

import { GeneralSettings } from "./pages/admin/settings/general/_page/GeneralSettings";
import { ConnectionSettings } from "./pages/admin/settings/connections/_page/ConnectionSettings";
import { CategorySettings } from "./pages/admin/settings/categories/_page/CategorySettings";
import { ExpenseSettings } from "./pages/admin/settings/expenses/_page/ExpenseSettings";
import { ReportSettings } from "./pages/admin/settings/reports/_page/ReportSettings";
import { UserList } from "./pages/admin/settings/users/_page/UserList";
import { OpenAISettings } from "./pages/admin/settings/openai/_page/OpenAISettings";

import { ClientSettings as ClockifyClientSettings } from "./pages/admin/settings/clockify/clients/_page/ClientSettings";
import { ProjectSettings as ClockifyProjectSettings } from "./pages/admin/settings/clockify/projects/_page/ProjectSettings";
import { TaskSettings as ClockifyTaskSettings } from "./pages/admin/settings/clockify/tasks/_page/TaskSettings";

import { VendorList as SapVendorList } from "./pages/admin/sap/vendors/_page/VendorList";

//vendor-portal
import { Root as VendorPortalRoot } from "./pages/vendor-portal/_page/Root";
import { PaymentDetails } from "./pages/vendor-portal/payment-details/_page/PaymentDetails";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Root />,
    loader: async () => {
      const authUser = await checkAuthUser();

      await requireAuth();

      if (!authUser) {
        throw redirect("/auth/login");
      }

      return { authUser };
    },
    children: [
      {
        index: true,
        element: <Navigate to="expensify" />,
      },

      {
        path: "admin",
        element: <AdminRoot />,
        children: [
          {
            path: "expensify",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Home />,
              },
              {
                path: "expenses",
                element: <ExpenseList />,
              },
              {
                path: "reports",
                element: <ExpenseReportList />,
              },
            ],
          },
          {
            path: "clockify",
            element: <Outlet />,
            children: [
              {
                path: "track",
                element: <ClockifyTrack />,
              },
              {
                path: "time-entries",
                element: <ClockifyTimeEntryList />,
              },
              {
                path: "weekly-timesheets",
                element: <ClockifyWeeklyTimesheetList />,
              },
              {
                path: "reports",
                element: <ClockifyReports />,
              },
            ],
          },
          {
            path: "sap",
            element: <Outlet />,
            children: [
              {
                path: "vendors",
                element: <SapVendorList />,
              },
            ],
          },
          {
            path: "settings",
            element: (
              <AdminRouteGuard>
                <Outlet />
              </AdminRouteGuard>
            ),
            children: [
              {
                index: true,
                element: <GeneralSettings />,
              },
              {
                path: "categories",
                element: <CategorySettings />,
              },
              {
                path: "currencies",
                element: <CurrencySettings />,
              },
              {
                path: "users",
                element: <UserList />,
              },

              {
                path: "expenses",
                element: <ExpenseSettings />,
              },
              {
                path: "reports",
                element: <ReportSettings />,
              },
              {
                path: "connections",
                element: <ConnectionSettings />,
              },
              {
                path: "clockify",
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <ClockifyClientSettings />,
                  },
                  {
                    path: "clients",
                    element: <ClockifyClientSettings />,
                  },
                  {
                    path: "projects",
                    element: <ClockifyProjectSettings />,
                  },
                  {
                    path: "tasks",
                    element: <ClockifyTaskSettings />,
                  },
                ],
              },
            ],
          },

          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },

      {
        path: "vendor-portal",
        element: <VendorPortalRoot />,
        children: [
          {
            index: true,
            element: <Navigate to="payment-details" />,
          },
          {
            path: "payment-details",
            element: <PaymentDetails />,
          },

          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },

      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },

  {
    path: "/auth/login",
    element: <Login />,
    loader: async () => {
      await requireAnon();
      return null;
    },
  },
  {
    path: "/auth/register",
    element: <Register />,
    loader: async () => {
      await requireAnon();
      return null;
    },
  },

  {
    path: "/invitations/:invitationId",
    element: <Invitation />,
    loader: async () => {
      await requireAnon();
      return null;
    },
  },
]);

import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import store from "@/redux/store";
import AdminRouteGuard from "./pages/_page/AdminRouteGuard";
import { CurrencySettings } from "./pages/admin/settings/currencies/_page/CurrencySettings";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
        <Toaster className="z-[100]" />
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export default App;
