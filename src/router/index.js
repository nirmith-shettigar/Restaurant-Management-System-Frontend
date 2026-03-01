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

import ManagerDashboard from "../views/dashboards/manager/ManagerDashboard.vue";
import DisplayUser from "../views/dashboards/manager/DisplayUser.vue";
import CreateUser from "../views/dashboards/manager/CreateUser.vue";

import ChefDashboard from "../views/dashboards/chef/ChefDashboard.vue";

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
  {
    path: "/customer",
    name: "CustomerDashboard",
    component: CustomerDashboard,
    meta: { role: "CUSTOMER" },
  },
  {
    path: "/customer/bookings",
    name: "CustomerBookings",
    component: CustomerBookings,
    meta: { role: "CUSTOMER" },
  },
  {
    path: "/customer/menu",
    name: "CustomerMenu",
    component: CustomerMenu,
    meta: { role: "CUSTOMER" },
  },
  {
    path: "/waiter",
    name: "WaiterDashboard",
    component: WaiterDashboard,
    meta: { role: "WAITER" },
  },
  {
    path: "/waiter/create-order",
    name: "CreateOrder",
    component: CreateOrder,
    meta: { role: "WAITER" },
  },
  {
    path: "/manager",
    component: ManagerDashboard,
    meta: { role: "MANAGER" },
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
  {
    path: "/chef",
    name: "ChefDashboard",
    component: ChefDashboard,
    meta: { role: "CHEF" },
  },
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
  const userRole = store.getters["auth/userRole"];

  if (isLoggedIn && (to.name === "Login" || to.name === "Register")) {
    return next({ name: "Home" });
  }

  if (to.meta.role) {
    if (!isLoggedIn) {
      return next({ name: "Login" });
    }

    if (to.meta.role !== userRole) {
      const dashboardMap = {
        CUSTOMER: "/customer",
        WAITER: "/waiter",
        CHEF: "/chef",
        MANAGER: "/manager",
      };

      return next(dashboardMap[userRole] || "/");
    }
  }

  next();
});

export default router;
