<template>
  <div class="mt-12">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
    <div v-if="loading" class="flex justify-center py-8">Loading orders...</div>

    <div v-else-if="orders.length > 0" class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-lg shadow p-6 flex items-center justify-between"
      >
        <div class="space-y-1">
          <p class="text-md font-semibold text-gray-800">{{ order.id }}</p>
          <p class="text-sm text-gray-600">Table: {{ order.tableId }}</p>
          <p class="text-xs text-gray-500">{{ formatTime(order.time) }}</p>
        </div>

        <div class="flex flex-col space-y-2">
          <select
            v-model="order.status"
            @change="handleStatusChange(order)"
            :disabled="order.status !== 'PREPARED'"
            class="px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="PENDING" disabled>Pending</option>
            <option value="PREPARING" disabled>Preparing</option>
            <option value="PREPARED" disabled>Prepared</option>
            <option value="SERVED">Served</option>
          </select>

          <button
            @click="openOrderDetails(order)"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            View
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">No orders found</p>
    </div>

    <OrderDetailsModal
      :isOpen="isModalOpen"
      :order="selectedOrder"
      @close="closeOrderDetails"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import {
  getOrdersByWaiterId,
  updateOrderStatus,
} from "../../services/orderService";
import { formatTime } from "../../utils/timeUtil";
import OrderDetailsModal from "./OrderDetailsModal.vue";

const store = useStore();
const orders = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const selectedOrder = ref({});

const currentUser = computed(() => store.getters["auth/currentUser"]);

onMounted(async () => {
  try {
    loading.value = true;
    const waiterId = currentUser.value?.id;
    if (waiterId) {
      const data = await getOrdersByWaiterId(waiterId);
      orders.value = data;
    }
  } catch (error) {
    console.error("Error loading orders:", error);
  } finally {
    loading.value = false;
  }
});

const handleStatusChange = async (order) => {
  try {
    await updateOrderStatus(order.id, order.status);
    const waiterId = currentUser.value?.id;
    if (waiterId) {
      const data = await getOrdersByWaiterId(waiterId);
      orders.value = data;
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

const openOrderDetails = (order) => {
  selectedOrder.value = order;
  isModalOpen.value = true;
};

const closeOrderDetails = () => {
  isModalOpen.value = false;
  selectedOrder.value = {};
};
</script>
