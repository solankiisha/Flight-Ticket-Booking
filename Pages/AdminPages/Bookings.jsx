import { useEffect, useState } from "react";
import { Pencil, X, Download, ChevronDown, Search, XCircle } from "lucide-react";
import getStatus from "../../Helper/getStatus";
import formatDate from "../../Helper/formatDate";
import EditBookingModal from "../../components/EditBookingModal.jsx";
import { ApiService } from "../../services/ApiService.js";

export default function ManageBookings() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [flightTripFilter, setFlightTripFilter] = useState("");

    const loadTickets = async () => {
        const response = await ApiService.get("/tickets/list");
        const tickets = response?.data;
        if (!tickets) {
            console.log("No ticket data received", response);
            return;
        }

        const formatted = tickets.map((item) => ({
            id: item.id,
            user: item.user?.name,
            flightTrip: item.flightTrip?.title,
            date: formatDate(item.flightTrip?.date),
            rawDate: item.flightTrip?.date,
            time: item.flightTrip?.time,
            tickets: item.seats.join(', '),
            price: item.price,
            status: getStatus(item.flightTrip?.date, item.flightTrip?.time),
            capacity: item?.flightTrip?.capacity
        }));

        setBookings(formatted);
        setFilteredBookings(formatted);
    };


    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        let temp = [...bookings];

        if (searchTerm.trim() !== "") {
            temp = temp.filter((b) =>
                b.id.toString().includes(searchTerm) ||
                b.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.flightTrip.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "") {
            temp = temp.filter((b) => b.status === statusFilter);
        }

        if (flightTripFilter !== "") {
            temp = temp.filter((b) => b.flightTrip === flightTripFilter);
        }

        setFilteredBookings(temp);
    }, [searchTerm, statusFilter, flightTripFilter, bookings]);

    const openEditModal = (booking) => {
        setSelectedBooking(booking);
        setIsEditOpen(true);
        console.log(booking)
    };

    const closeModal = () => {
        setIsEditOpen(false);
        setSelectedBooking(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedBooking((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (data) => {
        await ApiService.put(`/tickets/update/${data.id}`, data)
        loadTickets()
        closeModal();
    };

    const deleteBooking = async (booking) => {
        await ApiService.delete(`/tickets/delete/${booking.id}`)
        loadTickets()
    }

    const handleExport = async (booking) => {
        try {
            const response = await ApiService.postBlob("/tickets/export/excel", Array.isArray(booking) ? booking : [booking])
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "tickets.xlsx");

            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Excel download error:", error);
        }

    }
    const flightTripNames = bookings.map((b) => b.flightTrip);
    const uniqueFlightTrips = [...new Set(flightTripNames)];

    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
                <p className="text-gray-500 mt-1">
                    View, create, and manage all ticket bookings
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 w-full">

                    {/* Search Icon */}
                    <button
                        className="cursor-pointer relative left-1 bg-[#2F7AE5] hover:bg-blue-600 text-white rounded-full p-2 shadow-md transition"
                    >
                        <Search size={16} />
                    </button>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search by ID, user, or flight trip..."
                        className="px-5 py-2 pr-12 rounded-full border border-gray-200 bg-white shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none px-5 py-2 pr-10 rounded-full border border-gray-200 bg-white shadow-sm"
                        >
                            <option value="">All Status</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="LIVE">Live</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <ChevronDown size={18} className="absolute border-blue-200 right-4 top-1/2 -translate-y-1/2 text-blue-400" />
                    </div>

                    {/* Flight Trip Filter */}
                    <div className="relative">
                        <select
                            value={flightTripFilter}
                            onChange={(e) => setFlightTripFilter(e.target.value)}
                            className="appearance-none px-5 py-2 pr-10 rounded-full border border-blue-200 bg-white shadow-sm"
                        >
                            <option value="">All Trips</option>
                            {uniqueFlightTrips.map((flightTrip, index) => (
                                flightTrip && (
                                    <option key={index} value={flightTrip}>
                                        {flightTrip}
                                    </option>
                                )
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400" />
                    </div>

                </div>

                <button className="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition"
                    onClick={() => handleExport(filteredBookings)}>
                    <Download size={16} /> Export
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-t-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-blue-100 text-gray-800 font-semibold">
                        <tr>
                            <th className="p-4 text-left">Booking ID</th>
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Flight Trip</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Time</th>
                            <th className="p-4 text-left">Tickets</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBookings.map((booking) => (
                            <tr
                                key={booking.id}
                                className="border-b-4 border-b-white last:border-b-0 bg-gray-100 transition"
                            >
                                <td className="p-4">{booking.id}</td>
                                <td className="p-4">{booking.user}</td>
                                <td className="p-4">{booking.flightTrip}</td>
                                <td className="p-4">{booking.date}</td>
                                <td className="p-4">{booking.time}</td>
                                <td className="p-4">{booking.tickets}</td>

                                <td className="p-4">
                                    <span
                                        className={`text-white px-4 py-1 rounded-full text-xs font-semibold capitalize 
                                        ${booking.status === "UPCOMING"
                                                ? " bg-blue-400"
                                                : booking.status === "LIVE"
                                                    ? "bg-yellow-400 "
                                                    : "bg-green-400 "
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>

                                <td className="p-4 text-center flex items-center">
                                    <button
                                        onClick={() => openEditModal(booking)}
                                        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                                        onClick={() => deleteBooking(booking)}>
                                        <XCircle color="red" size={20} />
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditBookingModal
                isEditOpen={isEditOpen}
                selectedBooking={selectedBooking}
                closeModal={closeModal}
                handleChange={handleChange}
                handleSave={handleSave}
            />
        </div>
    );
}