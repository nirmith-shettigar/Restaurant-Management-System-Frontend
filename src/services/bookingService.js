import api from "./api";

export const getTodayBookings = async () => {
  try {
    const response = await api.get("/bookings");
    const today = new Date().toISOString().split("T")[0];

    return response.data.filter((booking) => {
      const bookingDate = new Date(booking.bookingTime)
        .toISOString()
        .split("T")[0];
      return bookingDate === today;
    });
  } catch (error) {
    console.error("Error fetching today's bookings:", error);
    throw error;
  }
};