// import { useState, useEffect } from "react";
// import { Calendar, Clock, Users } from "lucide-react";
// import BookingModal from "../../components/BookingModal.jsx";
// import getStatus from "../../Helper/getStatus.js";
// import { useNavigate } from "react-router-dom";
// import { ApiService } from "../../services/ApiService.js";

// const dashboardStats = [
//     {
//         id: 1,
//         title: "Total Bookings",
//         value: 2,
//         bg: "bg-cyan-50",
//         iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
//     },
//     {
//         id: 2,
//         title: "Available Flight Trips",
//         value: 4,
//         tag: "Upcoming and Live",
//         bg: "bg-cyan-50",
//         iconBg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
//     },
// ];

// const Dashboard = () => {
//     const navigate = useNavigate()
//     const user = JSON.parse(localStorage.getItem('authDetail-tickethub'))
//     const name = user.name.split(' ')[0]
//     const id = user.id;
//     const [flightTrips, setFlightTrips] = useState([])
//     const [open, setOpen] = useState(false);
//     const [selectedFlightTrip, setSelectedFlightTrip] = useState(null);
//     const [dashBoardStatasctics, setDashBoardStatistics] = useState(dashboardStats)

//     const loadFlightTrips = async () => {

//         const res = await ApiService.post("/flight_trips/list", {})

//         console.log(res)
//         let status = "";
//         let upcommingCount = 0
//         let launchedCount = 0
//         const formattedData = res.data.flightTrips.map((flightTrip) => {
//             const isoDate = flightTrip.date
//             const date = new Date(isoDate);
//             const options = { month: "short", day: "2-digit", year: "numeric" };
//             const formatted = date.toLocaleDateString("en-US", options);
//             status = getStatus(flightTrip.date, flightTrip.time);
//             if (status === "LIVE") launchedCount++;
//             if (status === "UPCOMING") upcommingCount++;
//             return { ...flightTrip, date: formatted }
//         })
//         setFlightTrips(formattedData.slice(0, 3));
//         const totalBookings = res?.data?.totalBookings
//         const modifiedStats = dashBoardStatasctics.map((item) => {
//             if (item.id == 1) {
//                 return { ...item, value: totalBookings }
//             }
//             if (item.id == 2) {
//                 return { ...item, value: launchedCount + upcommingCount }
//             }
//         })
//         setDashBoardStatistics(modifiedStats)
//     };

//     useEffect(() => {
//         loadFlightTrips()
//     }, [])

//     const handleBooking = async (data) => {
//         const payload = { flightTripId: data.id, userId: id, price: data.total, noOfTickets: data.ticketCount, seats: data.seats }
//         const response = await ApiService.post("/tickets/add", payload)
//         alert(response?.description)
//         setOpen(false)
//         loadFlightTrips()
//     }

//     return (
//         <>
//             <div className="min-h-screen" style={{background: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)'}}>
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

//                     {/* Greeting Section */}
//                     <div className="mb-10">
//                         <h1 className="text-4xl mt-8 text-center font-bold text-black-700">
//                             Good day, {name}!
//                         </h1>
//                         <p className="text-gray-500 text-center mt-5 text-lg">
//                             Here's what's happening with your bookings
//                         </p>
//                     </div>

//                     {/* Stats Section */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//                         {dashBoardStatasctics.map((stat) => (
//                             <div
//                                 key={stat.id}
//                                 className={`p-8 rounded-2xl ${stat.bg} shadow-md hover:shadow-lg transition-shadow flex justify-between items-center`}
//                                 style={{
//                                     background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
//                                     border: '1px solid rgba(99,102,241,0.08)',
//                                     backdropFilter: 'blur(6px) saturate(120%)'
//                                 }}
//                             >
//                                 <div className="w-full">
//                                     <div className={`w-full flex justify-between items-center text-white  mb-4`}>
//                                         <div className={`w-12 h-12 ${stat.iconBg}  flex items-center justify-center rounded-xl`}>
//                                             <Users size={20} />
//                                         </div>
//                                         <div>
//                                             {stat.tag && (
//                                                 <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
//                                                     {stat.tag}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
//                                         <h3 className="text-3xl font-bold mt-1 text-slate-900">{stat.value}</h3>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Popular flightTrip Header */}
//                     <div className="flex items-center justify-between mb-8">
//                         <div>
//                             <h2 className="text-2xl font-bold text-black-700">Popular flightTrip</h2>
//                             <p className="text-black-500 text-sm mt-1">Book your tickets now</p>
//                         </div>
//                         <button onClick={() => navigate('/user/flight_trips')} className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
//                             View All →
//                         </button>
//                     </div>

//                     {/* flightTrip Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {flightTrips.map((flightTrip) => {

//                             return (
//                                 <div
//                                     key={flightTrip.id}
//                                     className="rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
//                                     style={{
//                                         background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
//                                         border: '1px solid rgba(99,102,241,0.08)',
//                                         backdropFilter: 'blur(6px) saturate(120%)'
//                                     }}
//                                 >
//                                     <div>
//                                         <h3 className="text-lg font-bold text-slate-900 mb-1">
//                                             {flightTrip.title}
//                                         </h3>
//                                         <p className="text-slate-600 text-sm mb-5">
//                                             {flightTrip.description}
//                                         </p>

//                                         <div className="space-y-3 text-sm text-slate-600">
//                                             <div className="flex items-center gap-2">
//                                                 <Calendar size={16} /> {flightTrip.date}
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <Clock size={16} /> {flightTrip.time}
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <Users size={16} /> {parseInt(flightTrip.bookingCount)}/{flightTrip.capacity} booked
//                                             </div>
//                                         </div>

//                                         <div className="mt-6">
//                                             <div className="flex justify-between text-xs text-slate-500 mb-1">
//                                                 <span>Availability</span>
//                                                 <span>{100 - (parseInt(flightTrip.bookingCount) / flightTrip.capacity) * 100}%</span>
//                                             </div>
//                                             <div className="w-full h-2 rounded-full bg-slate-200">
//                                                 <div
//                                                     className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
//                                                     style={{ width: `${100 - (parseInt(flightTrip.bookingCount) / flightTrip.capacity) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-6">
//                                         <div>
//                                             <p className="text-xs text-slate-500">Price</p>
//                                             <p className="text-xl font-bold text-slate-900">${flightTrip.price}</p>
//                                         </div>

//                                         <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white cursor-pointer px-6 py-2 rounded-full text-sm hover:shadow-lg transition-shadow font-semibold" onClick={() => {
//                                             setSelectedFlightTrip(flightTrip);
//                                             setOpen(true);
//                                         }}>
//                                             Book Now
//                                         </button>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>

//                 </div>
//             </div>

//             {open && <BookingModal
//                 flightTrips={selectedFlightTrip}
//                 isOpen={open}
//                 onConfirm={handleBooking}
//                 onClose={() => setOpen(false)}
//             />}
//         </>
//     );
// };

// export default Dashboard;

import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Ticket, Plane } from "lucide-react";
import BookingModal from "../../components/BookingModal.jsx";
import getStatus from "../../Helper/getStatus.js";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../services/ApiService.js";

/* ===============================
   DASHBOARD STATS CONFIG
   =============================== */
const dashboardStats = [
  {
    id: 1,
    title: "Total Bookings",
    value: 0,
    icon: Ticket,
    gradient: "from-blue-600 to-indigo-600",
    tag: "Confirmed",
  },
  {
    id: 2,
    title: "Available Flight Trips",
    value: 0,
    icon: Plane,
    gradient: "from-cyan-500 to-blue-500",
    tag: "Live & Upcoming",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("authDetail-tickethub"));
  const name = user.name.split(" ")[0];
  const id = user.id;

  const [flightTrips, setFlightTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFlightTrip, setSelectedFlightTrip] = useState(null);
  const [dashBoardStatistics, setDashBoardStatistics] =
    useState(dashboardStats);

  /* ===============================
     LOAD DATA
     =============================== */
  const loadFlightTrips = async () => {
    const res = await ApiService.post("/flight_trips/list", {});

    let upcoming = 0;
    let live = 0;

    const formattedData = res.data.flightTrips.map((trip) => {
      const date = new Date(trip.date);
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const status = getStatus(trip.date, trip.time);
      if (status === "LIVE") live++;
      if (status === "UPCOMING") upcoming++;

      return { ...trip, date: formatted };
    });

    setFlightTrips(formattedData.slice(0, 3));

    const updatedStats = dashboardStats.map((item) => {
      if (item.id === 1) {
        return { ...item, value: res.data.totalBookings };
      }
      if (item.id === 2) {
        return { ...item, value: live + upcoming };
      }
      return item;
    });

    setDashBoardStatistics(updatedStats);
  };

  useEffect(() => {
    loadFlightTrips();
  }, []);

  /* ===============================
     BOOKING HANDLER
     =============================== */
  const handleBooking = async (data) => {
    const payload = {
      flightTripId: data.id,
      userId: id,
      price: data.total,
      noOfTickets: data.ticketCount,
      seats: data.seats,
    };

    const response = await ApiService.post("/tickets/add", payload);
    alert(response?.description);
    setOpen(false);
    loadFlightTrips();
  };

  return (
    <>
      {/* ===============================
          PAGE BACKGROUND
         =============================== */}
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* ===============================
              GREETING
             =============================== */}
          <div className="text-center mb-14">
            <h1 className="text-4xl font-extrabold text-slate-900">
              Welcome back, {name} ✈️
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              Manage your bookings and explore new flights
            </p>
          </div>

          {/* ===============================
              STATS SECTION
             =============================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {dashBoardStatistics.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.id}
                  className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-7 shadow-md hover:shadow-xl transition-all"
                >
                  {/* Decorative bubble */}
                  <div
                    className={`absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10`}
                  />

                  <div className="relative flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        {stat.title}
                      </p>
                      <h3 className="text-5xl font-extrabold text-slate-900 mt-2">
                        {stat.value}
                      </h3>
                      <span className="inline-block mt-4 text-xs font-bold text-blue-700 bg-blue-100 px-4 py-1 rounded-full">
                        {stat.tag}
                      </span>
                    </div>

                    <div
                      className={`w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                    >
                      <Icon size={34} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===============================
              FLIGHT HEADER
             =============================== */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Popular Flight Trips
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Book your seat before it’s gone
              </p>
            </div>

            <button
              onClick={() => navigate("/user/flight_trips")}
              className="text-sm font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-full hover:bg-blue-200 transition"
            >
              View All →
            </button>
          </div>

          {/* ===============================
              FLIGHT CARDS
             =============================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flightTrips.map((flightTrip) => (
              <div
                key={flightTrip.id}
                className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block mb-3 text-xs font-bold text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
                    Popular Flight
                  </span>

                  <h3 className="text-lg font-bold text-slate-900">
                    {flightTrip.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1 mb-5">
                    {flightTrip.description}
                  </p>

                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> {flightTrip.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} /> {flightTrip.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />{" "}
                      {flightTrip.bookingCount}/{flightTrip.capacity} booked
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Availability</span>
                      <span>
                        {100 -
                          (flightTrip.bookingCount / flightTrip.capacity) *
                            100}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                        style={{
                          width: `${
                            100 -
                            (flightTrip.bookingCount /
                              flightTrip.capacity) *
                              100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-6">
                  <div>
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="text-xl font-extrabold text-slate-900">
                      ₹{flightTrip.price}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFlightTrip(flightTrip);
                      setOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold text-sm hover:scale-105 hover:shadow-xl transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===============================
          BOOKING MODAL
         =============================== */}
      {open && (
        <BookingModal
          flightTrips={selectedFlightTrip}
          isOpen={open}
          onConfirm={handleBooking}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
