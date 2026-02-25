import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

import Home from "../views/Home.vue";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import NotFound from "../views/NotFound.vue";

import CustomerDashboard from "../views/dashboards/customer/CustomerDashboard.vue";
import CustomerBookings from "../views/dashboards/customer/CustomerBookings.vue";
import CustomerMenu from "../views/dashboards/customer/CustomerMenu.vue";

import WaiterDashboard from "../views/dashboards/waiter/WaiterDashboard.vue";
import CreateOrder from "../views/dashboards/waiter/CreateOrder.vue";
import TodayBookings from "../views/dashboards/waiter/TodayBookings.vue";

import ManagerDashboard from "../views/dashboards/manager/ManagerDashboard.vue";
import DisplayUser from "../views/dashboards/manager/DisplayUser.vue";
import CreateUser from "../views/dashboards/manager/CreateUser.vue";

import ChefDashboard from "../views/dashboards/chef/ChefDashboard.vue";
import KitchenOrders from "../views/dashboards/chef/KitchenOrders.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { hideNavbar: true },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { hideNavbar: true },
  },
  // Customer Routes
  {
    path: "/customer",
    name: "CustomerDashboard",
    component: CustomerDashboard,
  },
  {
    path: "/customer/bookings",
    name: "CustomerBookings",
    component: CustomerBookings,
  },
  {
    path: "/customer/menu",
    name: "CustomerMenu",
    component: CustomerMenu,
  },
  // Waiter Routes
  {
    path: "/waiter",
    name: "WaiterDashboard",
    component: WaiterDashboard,
  },
  {
    path: "/waiter/create-order",
    name: "CreateOrder",
    component: CreateOrder,
  },
  {
    path: "/waiter/bookings",
    name: "TodayBookings",
    component: TodayBookings,
  },
  // Manager Routes
  {
    path: "/manager",
    component: ManagerDashboard,
    children: [
      {
        path: "",
        component: DisplayUser,
      },
      {
        path: "create-user",
        component: CreateUser,
      },
      {
        path: "users",
        component: DisplayUser,
      },
    ],
  },

  // Chef Routes
  {
    path: "/chef",
    name: "ChefDashboard",
    component: ChefDashboard,
  },
  {
    path: "/chef/orders",
    name: "KitchenOrders",
    component: KitchenOrders,
  },
  // 404 Not Found
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters["auth/isAuthenticated"];

  if (isLoggedIn && (to.name === "Login" || to.name === "Register")) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
