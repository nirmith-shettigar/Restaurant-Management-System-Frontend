import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createStore } from "vuex";
import { createRouter, createMemoryHistory } from "vue-router";
import CustomerMenu from "../../views/dashboards/customer/CustomerMenu.vue";
import * as menuService from "../../services/menuService";

const makeStore = ({
  isAuthenticated = true,
  user = { id: 1, role: "CUSTOMER" },
} = {}) =>
  createStore({
    modules: {
      auth: {
        namespaced: true,
        state: { user: isAuthenticated ? user : null, isAuthenticated },
        getters: {
          currentUser: (s) => s.user,
          isAuthenticated: (s) => s.isAuthenticated,
          userRole: (s) => s.user?.role || null,
        },
      },
    },
  });

const makeRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/login", component: { template: "<div />" } },
      { path: "/customer", component: { template: "<div />" } },
      { path: "/customer/menu", component: { template: "<div />" } },
    ],
  });

const mountMenu = (storeOpts, router) =>
  mount(CustomerMenu, {
    global: {
      plugins: [makeStore(storeOpts), router],
      stubs: {
        MenuItem: {
          name: "MenuItem",
          props: ["item"],
          template: '<div class="menu-item">{{ item.name }}</div>',
        },
        ArrowLeft: true,
        UtensilsCrossed: true,
        RouterLink: true,
      },
    },
  });

beforeEach(() => {
  vi.spyOn(menuService, "getMenuItems").mockResolvedValue([]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CustomerMenu - rendering", () => {
  it("renders the Our Menu heading", async () => {
    const wrapper = mountMenu({}, makeRouter());
    await flushPromises();
    expect(wrapper.text()).toContain("Our Menu");
  });

  it("shows loading state before items are fetched", () => {
    vi.spyOn(menuService, "getMenuItems").mockResolvedValue([]);
    const wrapper = mountMenu({}, makeRouter());
    expect(wrapper.text()).toContain("Loading menu items");
  });
});

describe("CustomerMenu - menu items", () => {
  it("renders a MenuItem component for each item", async () => {
    vi.spyOn(menuService, "getMenuItems").mockResolvedValue([
      { id: 1, name: "Pasta", price: 10 },
      { id: 2, name: "Pizza", price: 12 },
      { id: 3, name: "Salad", price: 8 },
    ]);
    const wrapper = mountMenu({}, makeRouter());
    await flushPromises();
    expect(wrapper.findAll(".menu-item").length).toBe(3);
  });

  it("shows empty state message when there are no menu items", async () => {
    vi.spyOn(menuService, "getMenuItems").mockResolvedValue([]);
    const wrapper = mountMenu({}, makeRouter());
    await flushPromises();
    expect(wrapper.text()).toContain("No menu items available");
  });
});
