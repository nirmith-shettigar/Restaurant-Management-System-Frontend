import api from "./api";

export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrdersByWaiterId = async (waiterId) => {
  try {
    const response = await api.get("/orders", {
      params: { waiterId },
    });
    return response.data.filter((order) => order.status != "SERVED");
  } catch (error) {
    console.error("Error fetching orders by waiter:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw error;
  }
};