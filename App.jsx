import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Common Pages
import Login from "./Pages/CommonPages/Login";
import Register from "./Pages/CommonPages/Register";
import Unauthorized from "./Pages/CommonPages/Unauthorized";
import NotFound from "./Pages/CommonPages/NotFound";

// User Pages
import Dashboard from "./Pages/UserPages/Dashboard";
import MyBookings from "./Pages/UserPages/MyBookings";
import Profile from "./Pages/UserPages/Profile";
 import FlightTrips from "./Pages/UserPages/FlightTrips";

// Admin Pages
import AdminDashboard from "./Pages/AdminPages/Dashboard";
import AdminBookings from "./Pages/AdminPages/Bookings";
 import AdminFlightTrips from "./Pages/AdminPages/FlightTrips";

// Layouts
import UserLayout from "./Layout/UserLayout";
import AdminLayout from "./Layout/AdminLayout";
import AuthGuard from "./Guards/AuthGuard";
import RoleIndex from "./Guards/RoleIndex";

function App() {
  const router = createBrowserRouter([
    // ---------- PUBLIC ROUTES ----------
       
    { path: "/", element: <Login /> },

    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    // ---------- PROTECTED ROOT ----------
    {
      path: "/",
      element: (
        <AuthGuard requireAuth={true}>
          <RoleIndex />
        </AuthGuard>
      ),
    },
    // ---------- USER ROUTES ----------
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "my-bookings", element: <MyBookings /> },
        { path: "profile", element: <Profile /> },
        { path: "flight_trips", element: <FlightTrips/> },
      ],
    },

    // ---------- ADMIN ROUTES ----------
    //  {
    //   path: "/admin",
    //   element: <AdminLayout />,
    //   children: [
    //     { path: "dashboard", element: <AdminDashboard /> },
    //     // { path: "bookings", element: <AdminBookings /> },
    //     { path: "flight_trips", element: <AdminFlightTrips /> },
    //   ],
    // },
    {
  path: "/admin",
  element: (
    <AuthGuard requireAuth={true} allowedRoles={["admin"]}>
      <AdminLayout />
    </AuthGuard>
  ),
  children: [
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "flight_trips", element: <AdminFlightTrips /> },
    { path: "bookings", element: <AdminBookings /> }  ],
},


    // ---------- OTHER ----------
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "*", element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
