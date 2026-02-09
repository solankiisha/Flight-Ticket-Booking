import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import BookingModal from "../../components/BookingModal.jsx";
import getStatus from "../../Helper/getStatus.js";
import { ApiService } from "../../services/ApiService.js";

const FlightTrips = () => {

    const user = JSON.parse(localStorage.getItem('authDetail-tickethub'))
    const id = user.id;
    const [flightTrips, setFlightTrips] = useState([])
    const [open, setOpen] = useState(false);
    
    const [selectedFlightTrips, setSelectedFlightTrips] = useState(null);

    const loadFlightTrips = async () => {
        const res = await ApiService.post("/flight_trips/list", {})
        let status = "";
        let upcomingCount = 0
        let launchedCount = 0
        const formattedData = res.data.flightTrips.map((flightTrips) => {
            const isoDate = flightTrips.date
            const date = new Date(isoDate);
            const options = { month: "short", day: "2-digit", year: "numeric" };
            const formatted = date.toLocaleDateString("en-US", options);
            status = getStatus(flightTrips.date, flightTrips.time);
            if (status === "LIVE") launchedCount++;
            if (status === "UPCOMING") upcomingCount++;
            return { ...flightTrips, date: formatted }
        })
        setFlightTrips(formattedData);
        const totalBookings = res?.data?.totalBookings
        const modifiedStats = dashBoardStatistics.map((item) => {
            if (item.id == 1) {
                return { ...item, value: totalBookings }
            }
            if (item.id == 2) {
                return { ...item, value: launchedCount + upcomingCount }
            }
        })
        setDashBoardStatistics(modifiedStats)
    };

    useEffect(() => {
        loadFlightTrips()
    }, [])

    const handleBooking = async (data) => {
        const payload = { flightTripId: data.id, userId: id, price: data.total, noOfTickets: data.ticketCount, seats: data.seats }
        const response = await ApiService.post("/tickets/add", payload)
        alert(response?.description)
        loadFlightTrips()
        setOpen(false)
        

    }
    return (
        <>
            <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flightTrips.map((flightTrips) => {

                        return (
                            <div
                                key={flightTrips.id}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">
                                        {flightTrips.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-5">
                                        {flightTrips.description}
                                    </p>

                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} /> {flightTrips.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} /> {flightTrips.time}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} /> {parseInt(flightTrips.bookingCount)}/{flightTrips.capacity} booked
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Availability</span>
                                            <span>{100 - (parseInt(flightTrips.bookingCount) / flightTrips.capacity) * 100}%</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-gray-200">
                                            <div
                                                className="h-2 bg-[#2F7AE5] rounded-full"
                                                style={{ width: `${100 - (parseInt(flightTrips.bookingCount) / flightTrips.capacity) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-4 mt-6">
                                    <div>
                                        <p className="text-xs text-gray-500">Price</p>
                                        <p className="text-xl font-bold">${flightTrips.price}</p>
                                    </div>

                                    <button className="bg-[#2F7AE5] text-white cursor-pointer px-6 py-2 rounded-full text-sm hover:bg-[#2F7AE5] transition" onClick={() => {
                                        setSelectedFlightTrips(flightTrips);
                                        setOpen(true);
                                    }}>
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {open && <BookingModal
                        flightTrips={selectedFlightTrips}
                        isOpen={open}
                        onConfirm={handleBooking}
                        onClose={() => setOpen(false)}
                    />}
                </div>
            </div>
        </>
    )
}

export default FlightTrips