// import { useState, useEffect } from "react";
// import { Calendar, Clock, Users, Armchair } from "lucide-react";
// import generateSeats from "../Helper/generateSeat";

// const BookingModal = ({ flightTrips, isOpen, onClose, onConfirm }) => {
//   const [seats, setSeats] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [lockTimer, setLockTimer] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);

//   useEffect(() => {
//     if (!flightTrips) return;

//     const generated = generateSeats(flightTrips.capacity || 0);
//     const bookedSeats = (flightTrips.allSeats || []).flat();

//     const finalSeats = generated.map((s) =>
//       bookedSeats.includes(s.number) ? { ...s, isBooked: true } : s
//     );

//     setSeats(finalSeats);
//   }, [flightTrips]);

//   useEffect(() => {
//     if (selectedSeats.length === 0) return;

//     if (lockTimer) clearTimeout(lockTimer);
//     setTimeLeft(120);

//     const timer = setTimeout(() => {
//       setSeats((prev) =>
//         prev.map((s) =>
//           selectedSeats.includes(s.number) ? { ...s, isBooked: false } : s
//         )
//       );
//       setSelectedSeats([]);
//     }, 2 * 60 * 1000);

//     setLockTimer(timer);
//   }, [selectedSeats]);

//   useEffect(() => {
//     if (timeLeft <= 0) return;

//     const intervalId = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, [timeLeft]);

//   if (!isOpen || !flightTrips) return null;
//   const toggleSeat = (seat) => {
//     if (seat.isBooked) return;

//     setSelectedSeats((prev) =>
//       prev.includes(seat.number)
//         ? prev.filter((num) => num !== seat.number)
//         : [...prev, seat.number]
//     );
//   };

//   const pricePerTicket = flightTrips.price;
//   const total = (selectedSeats.length * pricePerTicket).toFixed(2);

//   const groupedSeats = seats.reduce((group, seat) => {
//     const row = seat.number.charAt(0);
//     if (!group[row]) group[row] = [];
//     group[row].push(seat);
//     return group;
//   }, {});

//   return (
//     <div className="fixed overflow-scroll inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-lg p-5 rounded-xl shadow-xl">
//         {/* HEADER */}
//         <div className="flex justify-between items-start mb-3">
//           <h2 className="text-xl font-bold">{flightTrips.title}</h2>
//           <button
//             className="text-gray-600 hover:text-black text-xl"
//             onClick={onClose}
//           >
//             ×
//           </button>
//         </div>

//         {/* flightTrips INFO */}
//         <div className="grid grid-cols-2 bg-blue-100 p-3 rounded-lg text-sm space-y-2">
//           <div className="flex items-center gap-2 text-gray-700">
//             <Calendar size={18} /> {flightTrips.date}
//           </div>
//           <div className="flex items-center gap-2 text-gray-700">
//             <Clock size={18} /> {flightTrips.time}
//           </div>
//           <div className="flex items-center gap-2 text-gray-700">
//             <Users size={18} />{" "}
//             {flightTrips.capacity - (flightTrips.allSeats || []).flat().length} seats
//             available
//           </div>
//           {timeLeft > 0 && (
//             <div className="text-center text-red-600 font-semibold mr-6">
//               Seats will be released in {Math.floor(timeLeft / 60)}:
//               {(timeLeft % 60).toString().padStart(2, "0")}
//             </div>
//           )}
//         </div>

//         {/* SCREEN */}
//         <div className="mt-4">
//           <div className="text-center text-gray-500 text-sm mb-1">SCREEN</div>
//           <div className="mx-auto w-2/3 h-2 bg-gray-300 rounded-full"></div>
//         </div>

//         {/* SEAT SELECTION */}
//         <div className="mt-6 space-y-10 max-h-[250px] overflow-y-auto pr-2">
//           {Object.keys(groupedSeats).map((rowKey) => {
//             const rowSeats = groupedSeats[rowKey];

//             // Auto-shrink seat size based on capacity
//             const seatSize =
//               seats.length > 300
//                 ? "w-7 h-7"
//                 : seats.length > 150
//                 ? "w-8 h-8"
//                 : seats.length > 80
//                 ? "w-9 h-9"
//                 : "w-10 h-10";

//             return (
//               <div key={rowKey} className="grid place-items-center relative">
//                 {/* Dynamic grid */}
//                 <div
//                   className="grid gap-3"
//                   style={{
//                     gridTemplateColumns: `repeat(${Math.min(
//                       12,
//                       rowSeats.length
//                     )}, 1fr)`,
//                   }}
//                 >
//                   {rowSeats.map((seat) => (
//                     <div
//                       key={seat.number}
//                       className="flex flex-col items-center"
//                     >
//                       <button
//                         onClick={() => toggleSeat(seat)}
//                         disabled={seat.isBooked}
//                         className={`
//                   ${seatSize}
//                   flex items-center justify-center rounded-lg border transition
//                   ${
//                     seat.isBooked
//                       ? "bg-gray-300 border-gray-400 cursor-not-allowed"
//                       : selectedSeats.includes(seat.number)
//                       ? "bg-blue-100 text-white border-blue-100 scale-105 shadow"
//                       : "bg-blue-100 border-blue-100 hover:bg-blue-100"
//                   }
//                 `}
//                       >
//                         <Armchair
//                           size={
//                             seatSize.includes("w-7")
//                               ? 12
//                               : seatSize.includes("w-8")
//                               ? 14
//                               : 18
//                           }
//                           className={`
//                     ${seat.isBooked ? "text-gray-500" : ""}
//                     ${
//                       selectedSeats.includes(seat.number)
//                         ? "text-white"
//                         : "text-blue-900"
//                     }
//                   `}
//                         />
//                       </button>

//                       <span className="mt-1 text-[10px] font-medium text-gray-700">
//                         {seat.number}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* PRICE BOX */}
//         <div className="bg-blue-100 border p-3 mt-5 rounded-lg text-sm">
//           <div className="flex justify-between text-gray-700">
//             <span>Seats:</span>
//             <span>{selectedSeats.join(", ") || "None"}</span>
//           </div>
//           <div className="flex justify-between text-gray-700">
//             <span>Price:</span>
//             <span>${pricePerTicket}</span>
//           </div>
//           <div className="flex justify-between font-bold text-blue-900 text-lg mt-1">
//             <span>Total:</span>
//             <span>${total}</span>
//           </div>
//         </div>

//         {/* BUTTONS */}
//         <div className="flex justify-between mt-5">
//           <button
//             onClick={onClose}
//             className="w-[48%] py-2 rounded-full bg-blue-400 text-white hover:bg-gray-300 font-semibold"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={() => onConfirm({ ...flightTrips,total, seats: selectedSeats })}
//             disabled={selectedSeats.length === 0}
//             className="w-[48%] py-2 rounded-full bg-blue-400 text-white hover:bg-blue-100 font-semibold disabled:opacity-40"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingModal;
import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Armchair } from "lucide-react";
import generateSeats from "../Helper/generateSeat";

const BookingModal = ({ flightTrips, isOpen, onClose, onConfirm }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockTimer, setLockTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!flightTrips) return;

    const generated = generateSeats(flightTrips.capacity || 0);
    const bookedSeats = (flightTrips.allSeats || []).flat();

    const finalSeats = generated.map((s) =>
      bookedSeats.includes(s.number) ? { ...s, isBooked: true } : s
    );

    setSeats(finalSeats);
  }, [flightTrips]);

  useEffect(() => {
    if (selectedSeats.length === 0) return;

    if (lockTimer) clearTimeout(lockTimer);
    setTimeLeft(120);

    const timer = setTimeout(() => {
      setSeats((prev) =>
        prev.map((s) =>
          selectedSeats.includes(s.number)
            ? { ...s, isBooked: false }
            : s
        )
      );
      setSelectedSeats([]);
    }, 2 * 60 * 1000);

    setLockTimer(timer);
  }, [selectedSeats]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (!isOpen || !flightTrips) return null;

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seat.number)
        ? prev.filter((n) => n !== seat.number)
        : [...prev, seat.number]
    );
  };

  const pricePerTicket = flightTrips.price;
  const total = (selectedSeats.length * pricePerTicket).toFixed(2);

  const groupedSeats = seats.reduce((group, seat) => {
    const row = seat.number.charAt(0);
    if (!group[row]) group[row] = [];
    group[row].push(seat);
    return group;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-lg p-5 rounded-xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold">{flightTrips.title}</h2>
          <button
            className="text-xl text-gray-600 hover:text-black"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* FLIGHT INFO */}
        <div className="grid grid-cols-2 gap-2 bg-blue-100 p-3 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} /> {flightTrips.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} /> {flightTrips.time}
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Users size={16} />
            {flightTrips.capacity -
              (flightTrips.allSeats || []).flat().length}{" "}
            seats available
          </div>

          {timeLeft > 0 && (
            <div className="col-span-2 text-center text-red-600 font-semibold">
              Seats release in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>

        {/* COCKPIT */}
        <div className="mt-5 mb-6">
          <div className="mx-auto w-3/4 h-6 bg-gray-300 rounded-b-full"></div>
          <p className="text-center text-xs text-gray-500 mt-1">
            Cockpit
          </p>
        </div>

        {/* SEAT MAP */}
        <div className="max-h-[260px] overflow-y-auto space-y-6">
          {Object.keys(groupedSeats).map((rowKey) => {
            const rowSeats = groupedSeats[rowKey];
            const left = rowSeats.slice(0, 3);
            const right = rowSeats.slice(3, 6);

            return (
              <div
                key={rowKey}
                className="flex justify-center items-center gap-6"
              >
                {/* LEFT SIDE */}
                <div className="flex gap-2">
                  {left.map((seat) => (
                    <Seat
                      key={seat.number}
                      seat={seat}
                      toggleSeat={toggleSeat}
                      selectedSeats={selectedSeats}
                    />
                  ))}
                </div>

                {/* AISLE */}
                <div className="w-6 text-xs text-gray-400 text-center">
                  {rowKey}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex gap-2">
                  {right.map((seat) => (
                    <Seat
                      key={seat.number}
                      seat={seat}
                      toggleSeat={toggleSeat}
                      selectedSeats={selectedSeats}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* LEGEND */}
        <div className="flex justify-center gap-4 text-xs mt-4">
          <Legend color="bg-blue-200" text="Available" />
          <Legend color="bg-blue-500" text="Selected" />
          <Legend color="bg-gray-300" text="Booked" />
        </div>

        {/* PRICE BOX */}
        <div className="bg-blue-100 border p-3 mt-5 rounded-lg text-sm">
          <div className="flex justify-between">
            <span>Seats</span>
            <span>{selectedSeats.join(", ") || "None"}</span>
          </div>
          <div className="flex justify-between">
            <span>Price</span>
            <span>${pricePerTicket}</span>
          </div>
          <div className="flex justify-between font-bold text-blue-900 text-lg">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="w-[48%] py-2 rounded-full bg-gray-300 hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onConfirm({ ...flightTrips, total, seats: selectedSeats })
            }
            disabled={selectedSeats.length === 0}
            className="w-[48%] py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 font-semibold disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

/* SEAT COMPONENT */
const Seat = ({ seat, toggleSeat, selectedSeats }) => (
  <div className="flex flex-col items-center">
    <button
      onClick={() => toggleSeat(seat)}
      disabled={seat.isBooked}
      className={`
        w-8 h-10 rounded-t-lg rounded-b-sm border transition-all
        flex items-center justify-center
        ${
          seat.isBooked
            ? "bg-gray-300 border-gray-400 cursor-not-allowed"
            : selectedSeats.includes(seat.number)
            ? "bg-blue-500 border-blue-600 scale-105 shadow-md"
            : "bg-blue-200 border-blue-300 hover:bg-blue-300"
        }
      `}
    >
      <Armchair
        size={14}
        className={
          seat.isBooked
            ? "text-gray-500"
            : selectedSeats.includes(seat.number)
            ? "text-white"
            : "text-blue-900"
        }
      />
    </button>
    <span className="text-[10px] mt-1">{seat.number}</span>
  </div>
);

/* LEGEND COMPONENT */
const Legend = ({ color, text }) => (
  <div className="flex items-center gap-1">
    <span className={`w-4 h-4 ${color} rounded`} />
    {text}
  </div>
);

export default BookingModal;
