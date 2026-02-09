 import { CalendarCheck, DollarSign, Ticket } from "lucide-react";
//  import Highcharts from "highcharts";
//  import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HighchartsReactModule from "highcharts-react-official";
 import { useEffect, useState } from "react";
 import getStatus from "../../Helper/getStatus";
 import formatDate from "../../Helper/formatDate";
 import { useNavigate } from "react-router-dom";
 import { ApiService } from "../../services/ApiService";
 
const HighchartsReact =
  HighchartsReactModule.default ?? HighchartsReactModule;

 const stats = [
     {
         id: 1,
         title: "Total Bookings (24 hours)",
         value: 0,
         bg: "bg-blue-50",
         iconBg: "bg-blue-500",
         icon: CalendarCheck,
     },
     {
         id: 2,
         title: "Total Revenue (24 hours)",
         value: 0,
         bg: "bg-blue-50",
         iconBg: "bg-blue-500",
         icon: DollarSign,
     },
 ];


  const AdminDashboard = () => {
   
     const navigate = useNavigate()
     const [dashBoardStatistics, setDashBoardStatistics] = useState(stats)
     const [flightTrips, setFlightTrips] = useState([])
     const [bookingCount, setBookingCount] = useState([])
     const [bookingRevenue, setBookingRevenue] = useState([])
     const [bookings, setBookings] = useState([])
     const [bookingCapacity, setBookingCapacity] = useState([])
     const [cancelCount, setCancelledCount] = useState([])
     const [flightTripStatus, setFlightTripStatus] = useState([])

     const barChartOptions = {
         chart: { type: "column" },
         title: { text: null },
         credits: {
             enabled: false
         },
         xAxis: {
             categories: bookingRevenue.map((item) => item.name),
         },
         yAxis: {
             min: 0,
             title: { text: "Values" },
         },
         series: [
             {
                 name: "Booking",
                 data: bookingCount,
             },
             {
                 name: "Capacity",
                 data: bookingCapacity,
             },
             {
                 name: "Cancelled",
                 data: cancelCount,
             },
             {
                 name: "Revenue",
                 data: bookingRevenue,
             },
         ],
     };

     const pieChartOptions = {
         chart: { type: "pie" },
         title: { text: "" },
         credits: {
             enabled: false
         },
         plotOptions: {
             pie: {
                 innerSize: "60%",
                 dataLabels: { enabled: true },
             },
         },
         series: [
             {
                 name: "Flight Trip Status",
                 data: flightTripStatus,
             },
             
         ],
     };

     const loadFlightTrips = async () => {
         const res = await ApiService.post("/flight_trips/list", { isAdminFlightTrip: true })
         const allFlightTrips = res.data.flightTrips
         setFlightTrips(allFlightTrips);

         const statusCount = { UPCOMING: 0, LIVE: 0, COMPLETED: 0 };

         const modifiedStats = dashBoardStatistics.map((item) => {
             if (item.id == 1) {
                 return { ...item, value: res.data?.totalBookings }
             }
             if (item.id == 2) {
                 return { ...item, value: `$${res.data?.totalRevenue}` }
             }
             return item
         })
         const bookingCountData = allFlightTrips.map(flightTrip => ({
             name: flightTrip.title,
             y: Number(flightTrip.bookingCount)
         }));

         const cancelledCountData = allFlightTrips.map(flightTrip => ({
             name: flightTrip.title,
             y: Number(flightTrip.cancelledCount)
         }));

         const bookingCapacityData = allFlightTrips.map(flightTrip => ({
             name: flightTrip.title,
             y: Number(flightTrip.capacity)
         }));

         const bookingPriceData = allFlightTrips.map(flightTrip => ({
             name: flightTrip.title,
             y: Number(flightTrip.bookingPrice)
         }));

         allFlightTrips.forEach(flightTrip => {
             const status = getStatus(flightTrip.date, flightTrip.time);
             statusCount[status] += 1;
         });

         const chartData = [
             { name: "UPCOMING", y: statusCount.UPCOMING },
             { name: "LIVE", y: statusCount.LIVE },
             { name: "COMPLETED", y: statusCount.COMPLETED },
         ];

         setFlightTripStatus(chartData);
         setBookingCount(bookingCountData)
         setBookingCapacity(bookingCapacityData)
         setBookingRevenue(bookingPriceData)
         setDashBoardStatistics(modifiedStats)
         setCancelledCount(cancelledCountData)
     };
     const loadTickets = async () => {
         const response = await ApiService.get("/tickets/list")
         const tickets = response?.data;

         if (!tickets) {
             console.log("No ticket data received", response);
             return;
         }

         const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

         const recentBookings = tickets
             .filter(ticket => new Date(ticket.createdAt) >= twentyFourHoursAgo)
             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
             .slice(0, 2);

         const formatted = recentBookings.map((item) => ({
             id: item.id,
             user: item.user?.name,
             flightTrip: item.flightTrip?.title,
             date: formatDate(item.flightTrip?.date),
             time: item.flightTrip?.time,
             tickets: item.seats.join(', '),
             price: item.price,
             status: getStatus(item.flightTrip?.date, item.flightTrip?.time),
         }));
         setBookings(formatted);
     };

     useEffect(() => {
         loadFlightTrips()
     }, [])

     useEffect(() => {
         loadTickets()
     }, [])

     return (
         <div className="w-full p-6 space-y-6">
             {/* HEADER */}
             <div>
                 <h1 className="text-2xl font-bold">Dashboard</h1>
                 <p className="text-sm text-gray-500">Manage your ticket booking system</p>
             </div>
             {/* STATS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {dashBoardStatistics.map((item, index) => {
                     const Icon = item.icon ?? CalendarCheck;
                     return (
                         <div key={index} className={`${item.bg}  rounded-2xl shadow-sm p-5 flex justify-between items-center`}>
                             <div className="w-full">
                                 <div className="flex w-full justify-between items-start">
                                     <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center mb-2`}>
                                         <Icon className="text-white" size={20} />
                                     </div>
                                 </div>
                                 <p className="text-sm text-gray-600">{item.title}</p>
                                 <h2 className="text-2xl font-bold">{item.value}</h2>
                             </div>
                         </div>
                     );
                 })}
             </div>

             {/* CHARTS */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                      <h3 className="font-semibold mb-1">Flight Trip Bookings</h3>
                      <p className="text-sm text-gray-500 mb-4">Top performing Flight Trips</p>
                      {bookingCapacity.length == 0 && bookingCount.length == 0 && bookingRevenue.length == 0 && cancelCount.length == 0
                          ?
                          <p className="flex items-center justify-center min-h-full text-2xl font-medium">No Data Available</p>
                          :
                          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
                      }
              </div>

                   <div className="bg-white rounded-2xl shadow-sm p-5">
                      <h3 className="font-semibold mb-1">Flight Trip Status</h3>
                      <p className="text-sm text-gray-500 mb-4">Distribution overview</p>
                     {bookingCapacity.length == 0 && bookingCount.length == 0 && bookingRevenue.length == 0 && cancelCount.length == 0
                          ?
                          <p className="flex items-center justify-center min-h-full text-2xl font-medium">No Data Available</p>
                          :
                          <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
                      }
                  </div> 
              </div>

             {/* RECENT BOOKINGS */}
              {bookings.length > 0 && <div>
                 <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-semibold">Recent Bookings</h2>
                      <button className="text-purple-500 text-sm cursor-pointer font-medium"
                          onClick={() => navigate('/admin/bookings')}>View All →</button>
                 </div>

                  <div className="space-y-4">
                      {bookings.map((booking) => (
                          <div key={booking.id} className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center">
                              <div>
                                  <h4 className="font-semibold">{booking.flightTrip}</h4>
                                  <p className="text-sm text-gray-500">
                                      {booking.user} • {booking.date}
                                  </p>
                              </div>
                              <div className="flex items-center gap-3">
                                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                      {booking.tickets} seats
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full capitalize">
                                      {booking.status}
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>}
               </div>
     );
 }

 export default AdminDashboard

