import api from "./api";

export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrdersByWaiterId = async (waiterId) => {
  const response = await api.get("/orders", {
    params: { waiterId },
  });
  return response.data.filter((order) => order.status != "SERVED");
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}`, { status });
  return response.data;
};

export const createOrder = async (order) => {
  if (!order.tableId || !order.waiterId || !order.items?.length) {
    throw new Error('Missing required fields: tableId, waiterId, or items');
  }

  const response = await api.post('/orders', {
    ...order,
    status: "PENDING"
  })

  return response.data;
}