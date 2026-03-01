import api from "./api";

export const getTodayBookings = async () => {
  const response = await api.get("/bookings");
  const today = new Date().toISOString().split("T")[0];

  return response.data.filter((booking) => {
    const bookingDate = new Date(booking.bookingTime)
      .toISOString()
      .split("T")[0];
    return bookingDate === today;
  });
};

export const getUpcomingBookingsByCustomerId = async (customerId) => {
  const response = await api.get("/bookings");
  const now = new Date();

  return response.data.filter((booking) => {
    const bookingDate = new Date(booking.bookingTime);
    return (
      booking.customerId === customerId &&
      bookingDate >= now &&
      booking.status !== "CANCELLED"
    )
  })
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", {
    ...bookingData,
    status: "CONFIRMED",
  });
  return response.data;
};

export const updateBooking = async (bookingId, bookingData) => {
  const response = await api.patch(`/bookings/${bookingId}`, bookingData);
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}`, {
    status: "CANCELLED",
  });
  return response.data;
};
