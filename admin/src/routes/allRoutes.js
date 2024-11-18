import Login from "../pages/Authentication/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import AllUsers from "../pages/AllUsers/AllUsers";
import Bookings from "../pages/Bookings/Bookings";
import Categories from "../pages/Categories/Categories";
import ProfileSettings from "../pages/ProfileSettings"; // Add this import

const publicRoutes = [
  { path: "/login", component: Login },
  { path: "/*", component: Login },
];

const privateRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/user/:role", component: AllUsers },
  { path: "/bookings", component: Bookings },
  { path: "/categories", component: Categories },
  { path: "/profile", component: ProfileSettings }, // Add this route
  { path: "/*", component: Dashboard },
];

export { privateRoutes, publicRoutes };
