import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createStore } from "vuex";
import WaiterOrdersList from "../../components/order/WaiterOrdersList.vue";
import * as orderService from "../../services/orderService";

vi.mock("../../services/orderService");

const mockOrders = [
  { id: 101, tableId: 3, status: "PREPARED", time: new Date().toISOString() },
  { id: 102, tableId: 5, status: "PENDING", time: new Date().toISOString() },
];

const makeStore = (user = { id: 7, role: "WAITER" }) =>
  createStore({
    modules: {
      auth: {
        namespaced: true,
        state: { user },
        getters: {
          currentUser: (s) => s.user,
          isAuthenticated: (s) => !!s.user,
          userRole: (s) => s.user?.role || null,
        },
      },
    },
  });

const mountComponent = (user = { id: 7, role: "WAITER" }) =>
  mount(WaiterOrdersList, {
    global: {
      plugins: [makeStore(user)],
      stubs: { OrderDetailsModal: true },
    },
  });

describe("WaiterOrdersList.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    orderService.getOrdersByWaiterId.mockResolvedValue([]);
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain("Loading orders");
  });

  it("renders orders after mounting", async () => {
    orderService.getOrdersByWaiterId.mockResolvedValue(mockOrders);
    const wrapper = mountComponent();
    await flushPromises();
    expect(wrapper.text()).toContain("101");
    expect(wrapper.text()).toContain("102");
  });

  it("shows empty state when no orders", async () => {
    orderService.getOrdersByWaiterId.mockResolvedValue([]);
    const wrapper = mountComponent();
    await flushPromises();
    expect(wrapper.text()).toContain("No orders found");
  });

  it("calls updateOrderStatus when order status select changes", async () => {
    const preparedOrders = [
      {
        id: 55,
        tableId: 2,
        status: "PREPARED",
        time: new Date().toISOString(),
      },
    ];
    orderService.getOrdersByWaiterId.mockResolvedValue(preparedOrders);
    orderService.updateOrderStatus.mockResolvedValue({});
    const wrapper = mountComponent();
    await flushPromises();
    const select = wrapper.find("select");
    await select.trigger("change");
    expect(orderService.updateOrderStatus).toHaveBeenCalledWith(55, "PREPARED");
  });

  it("sets selectedOrder and opens modal when View button is clicked", async () => {
    orderService.getOrdersByWaiterId.mockResolvedValue(mockOrders);
    const wrapper = mountComponent();
    await flushPromises();
    const viewBtn = wrapper.findAll("button").find((b) => b.text() === "View");
    await viewBtn.trigger("click");
    expect(wrapper.vm.isModalOpen).toBe(true);
    expect(wrapper.vm.selectedOrder.id).toBe(101);
  });
});
