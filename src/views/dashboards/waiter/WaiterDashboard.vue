<template>
  <div class="min-h-screen bg-gray-50">
    <Toaster position="top-center" />
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Waiter Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage orders and bookings</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link
          to="/waiter/create-order"
          class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <ClipboardEdit :size="24" class="text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Take Order</h3>
              <p class="text-sm text-gray-600">Create new order</p>
            </div>
          </div>
        </router-link>

        <div
          @click="activeView = 'orders'"
          class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <ClipboardList :size="24" class="text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">My Orders</h3>
              <p class="text-sm text-gray-600">View your orders</p>
            </div>
          </div>
        </div>

        <div
          @click="activeView = 'bookings'"
          class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <CalendarDays :size="24" class="text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">
                Today's Bookings
              </h3>
              <p class="text-sm text-gray-600">View reservations</p>
            </div>
          </div>
        </div>
      </div>

      <WaiterOrdersList v-if="activeView === 'orders'" />
      <TodayBookingsList v-if="activeView === 'bookings'" />
    </div>
  </div>
</template>

<script setup>
import { ClipboardEdit, ClipboardList, CalendarDays } from "lucide-vue-next";
import WaiterOrdersList from "../../../components/order/WaiterOrdersList.vue";
import TodayBookingsList from "../../../components/booking/TodayBookingsList.vue";
import { Toaster } from "vue-sonner";
import { ref } from "vue";
const activeView = ref("orders");
</script>
