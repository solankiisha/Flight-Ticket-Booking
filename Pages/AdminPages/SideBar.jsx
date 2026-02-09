import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar,Plane,UserStar, LogOut } from "lucide-react";

const SideBar = () => {
  const navigate = useNavigate()
  
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Bookings", icon: Calendar, path: "/admin/bookings" },
    { name: "Flights", icon: Plane, path: "/admin/flight_trips" },
  ];

  const handleLogoutConfirm = () => {
    localStorage.removeItem('authDetail-tickethub')
    navigate("/login");
  };

  return (
    <>
      <aside className="w-72 h-screen bg-white  flex flex-col  shadow-lg">
        {/* Top Profile Section */}
        <div className="p-5 border-b">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#2F7AE5] rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {/* <img src="/logo.svg"/> */}
              <UserStar  />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Admin Panel</h2>
              <p className="text-sm font-semibold text-gray-500">Admin User</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all ${isActive
                  ? "bg-[#D9EEFB] text-[#2F7AE5] font-semibold"
                  : "text-gray-400 hover:bg-[#D9EEFB] hover:text-[#2F7AE5]"
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-5">
          <button className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gray-100 text-[#2F7AE5] hover:bg-[#D9EEFB] transition"
            onClick={() => handleLogoutConfirm()}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;