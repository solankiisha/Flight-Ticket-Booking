// import { Bell, LogOut } from "lucide-react";
// import { NavLink, useNavigate } from "react-router-dom";

// const Header = () => {
//   const navigate = useNavigate();

//   const navClass = ({ isActive }) =>
//     isActive
//       ? "text-[#2F7AE5] border-b-2 border-[#2F7AE5] pb-2 font-semibold"
//       : "text-gray-600 hover:text-[#2F7AE5] pb-2 transition font-semibold";

//   const auth = JSON.parse(localStorage.getItem("authDetail-tickethub"));
//   const name = auth?.name?.split(" ")[0] || "User";

//   const handleLogoutConfirm = () => {
//     localStorage.removeItem("authDetail-tickethub");
//     navigate("/login");
//   };

//   return (
//     <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      
//       {/* ================= TOP BAR ================= */}
//       <div className="flex items-center justify-between px-8 h-20">
        
//         {/* Brand */}
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F7AE5] to-[#4f8df7] flex items-center justify-center shadow-md">
//             <img src="/plane.svg" alt="logo" className="w-6 h-6" />
//           </div>

//           <div>
//             <h1 className="text-xl font-bold text-gray-900">
//               Flight Booking
//             </h1>
//             <p className="text-sm text-gray-500">
//               Welcome, {name}
//             </p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-4">
//           <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
//             <Bell className="w-5 h-5 text-[#2F7AE5]" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>

//           <button
//             onClick={handleLogoutConfirm}
//             className="flex items-center gap-2 px-4 py-2 rounded-full
//             bg-gradient-to-r from-[#2F7AE5] to-[#4f8df7]
//             text-white font-semibold text-sm
//             hover:shadow-lg transition"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* ================= NAV BAR ================= */}
//       <nav className="px-8">
//         <ul className="flex gap-8 text-sm">
//           <NavLink to="/user/dashboard" className={navClass}>
//             Dashboard
//           </NavLink>
//           <NavLink to="/user/my-bookings" className={navClass}>
//             My Bookings
//           </NavLink>
//           <NavLink to="/user/flight_trips" className={navClass}>
//             Flights
//           </NavLink>
//           <NavLink to="/user/profile" className={navClass}>
//             Profile
//           </NavLink>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;
import { Bell, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    isActive
      ? "text-[#2F7AE5] border-b-2 border-[#2F7AE5] pb-3 font-semibold"
      : "text-slate-600 hover:text-[#2F7AE5] pb-3 transition font-medium";

  const auth = JSON.parse(localStorage.getItem("authDetail-tickethub"));
  const name = auth?.name?.split(" ")[0] || "User";

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authDetail-tickethub");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-10 h-20">
        
        {/* BRAND */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2F7AE5] to-[#4f8df7] flex items-center justify-center shadow-lg">
            <img src="/plane.svg" alt="logo" className="w-6 h-6" />
          </div>

          <div className="leading-tight">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Flight Booking
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Welcome back, {name}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-5">
          <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition">
            <Bell className="w-5 h-5 text-[#2F7AE5]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={handleLogoutConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-gradient-to-r from-[#2F7AE5] to-[#4f8df7]
            text-white font-semibold text-sm
            hover:shadow-xl hover:scale-105 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* ================= NAV BAR ================= */}
      <nav className="px-10">
        <ul className="flex gap-10 text-sm font-semibold tracking-wide">
          <NavLink to="/user/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/user/my-bookings" className={navClass}>
            My Bookings
          </NavLink>
          <NavLink to="/user/flight_trips" className={navClass}>
            Flights
          </NavLink>
          <NavLink to="/user/profile" className={navClass}>
            Profile
          </NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
