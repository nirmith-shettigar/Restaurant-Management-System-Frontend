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

export const getUpcomingBookingsByCustomerId = async (customerId) => {
  try {
    const response = await api.get("/bookings", {
      params: { customerId },
    });
    const now = new Date();

    return response.data.filter((booking) => {
      const bookingDate = new Date(booking.bookingTime);
      return bookingDate >= now && booking.status !== "CANCELLED";
    });
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post("/bookings", {
      ...bookingData,
      status: "CONFIRMED",
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}`, bookingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${bookingId}:`, error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}`, {
      status: "CANCELLED",
    });
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error);
    throw error;
  }
};
