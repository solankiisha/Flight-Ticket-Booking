  import { useEffect, useState } from "react";
  import {
    Plus,
    Pencil,
    Trash2,
    Calendar,
    Clock,
    Users,
    DollarSign,
    X,
  } from "lucide-react";
  import { ApiService } from "../../services/ApiService";


 const AdminFlightTrips = () => {
    const [flightTrips, setFlightTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingFlightTrip, setEditingFlightTrip] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      date: "",
      time: "",
      capacity: 100,
      price: 0,
    });

     /* ---------------- LOAD FLIGHT TRIPS ---------------- */
    const loadFlightTrips = async () => {
      const res = await ApiService.post("/flight_trips/list", {
        isAdminFlightTrip: true,
        isFlightTripPage: true,
      });
      setFlightTrips(res.data.flightTrips);
    };

    useEffect(() => {
      loadFlightTrips();
    }, []);

     /* ---------------- FORM VALIDATION ---------------- */
    const validateForm = () => {
      let newErrors = {};

      if (!formData.title.trim()) newErrors.title = "Flight trip title is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.date) newErrors.date = "Flight trip date is required";
      if (!formData.time) newErrors.time = "Flight trip time is required";
      if (formData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
      if (formData.price < 0) newErrors.price = "Price cannot be negative";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

     /* ---------------- MODAL HANDLERS ---------------- */
    const openAddModal = () => {
      setEditingFlightTrip(null);
      setErrors({});
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        capacity: 100,
        price: 0,
      });
      setShowModal(true);
    };

    const openEditModal = (trip) => {
      setEditingFlightTrip(trip);
      setErrors({});
      setFormData({
        ...trip,
        date: trip.date?.split("T")[0] || "",
      });
      setShowModal(true);
    };

    const handleSave = async () => {
      if (!validateForm()) return;

      if (editingFlightTrip) {
        await ApiService.put(`/flight_trips/${editingFlightTrip.id}`, formData);
      } else {
        await ApiService.post("/flight_trips", formData);
      }

      setShowModal(false);
      loadFlightTrips();
    };

    const handleDelete = async (id) => {
      await ApiService.delete(`/flight_trips/${id}`);
      loadFlightTrips();
    };

    const toggleStatus = async (trip) => {
      await ApiService.put(`/flight_trips/${trip.id}`, {
        active: !trip.active,
      });
      loadFlightTrips();
    };

     /* ---------------- UI ---------------- */
   return (
    
  
      <div className="p-8">
        {/* Header */}
         <div className="flex justify-between items-center mb-6">
           <div>
             <h1 className="text-2xl font-semibold">Manage Flight Trips</h1>
             <p className="text-gray-500">Create and manage flight trips</p>
           </div>
           <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-full"
           >
             <Plus size={18} /> Add Flight Trip
           </button>
         </div>

         {/* Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {flightTrips.map((trip) => {
            const booked = Number(trip.bookingCount || 0);
            const capacity = Number(trip.capacity || 1);
            const progress = ((booked / capacity) * 100).toFixed(1);

            return (
              <div key={trip.id} className="bg-white p-6 rounded-3xl shadow border">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-semibold">{trip.title}</h2>
                     {/* <span className="text-xs text-red-500">
                       {trip.active ? "active" : "inactive"}
                     </span> */}
                     <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                            ${trip?.active
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"}
                          `}
                        >
                          {trip?.active ? "active" : "inactive"}
                        </span>

                   </div>

                   <div className="flex gap-2">
                     <Pencil onClick={() => openEditModal(trip)} className="cursor-pointer" />
                     <Trash2 onClick={() => handleDelete(trip.id)} className="cursor-pointer" />
                   </div>
                 </div>

                 <p className="text-gray-600 mt-2">{trip.description}</p>

                 {/* Info */}
                 <div className="grid grid-cols-2 gap-2 mt-3">
                   <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-full">
                     <Calendar size={16} />
                     {trip.date?.split("T")[0]}
                  </div>

                   <div className="flex items-center gap-2 bg-purple-100 p-2 rounded-full">
                     <Clock size={16} />
                     {trip.time}
                   </div>

                   <div className="flex items-center gap-2 bg-purple-100 p-2 rounded-full">
                     <Users size={16} />
                     {booked} / {capacity}
                  </div>

                   <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-full">
                     <DollarSign size={16} />
                     ${trip.price}
                   </div>
                </div>

                 {/* Progress */}
                 <div className="mt-4">
                   <div className="flex justify-between text-sm">
                     <span>Booking</span>
                     <span>{progress}%</span>
                   </div>
                   <div className="h-2 bg-gray-200 rounded-full">
                     <div
                      className="h-2 bg-blue-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                 {/* Toggle */}
                 <div className="flex justify-between mt-4 items-center">
                   <span>Status</span>
                  <button
                    onClick={() => toggleStatus(trip)}
                    className={`w-12 h-6 rounded-full transition ${
                      trip.active ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white  rounded-full transition-transform ${
                        trip.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

         {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-3xl w-full max-w-lg relative">
              <X className="absolute top-4 right-4 cursor-pointer" onClick={() => setShowModal(false)} />

              <h2 className="text-xl mb-4">
                {editingFlightTrip ? "Edit Flight Trip" : "Add Flight Trip"}
              </h2>

              <div className="space-y-3">
                <input
                  placeholder="Flight Trip"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 bg-gray-100 rounded-full"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

               <input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-gray-100 rounded-full"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                </div>

                 <div className="grid grid-cols-2 gap-2">
                 <input
                    type="number"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                </div>

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-200 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
     );
  };
 export default AdminFlightTrips;


