<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllOrders, updateOrderStatus } from '../../../services/orderService';
import OrderDetailsModal from '../../../components/order/OrderDetailsModal.vue';
import { toast, Toaster } from 'vue-sonner';

const orders = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const selectedOrder = ref({});

const fetchOrders = async () => {
  try {
    loading.value = true;
    const data = await getAllOrders();
    orders.value = data;
  } catch (error) {
    toast.error(error.message || 'Error fetching orders');
  } finally {
    loading.value = false;
  }
};

const handleStatusChange = async (order) => {
  try {
    await updateOrderStatus(order.id, order.status);
    await fetchOrders();
  } catch (error) {
    toast.error(error.message || 'Error updating order status');
    await fetchOrders();
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

const stats = computed(() => {
  return {
    newOrders: orders.value.filter(order => order.status === 'PENDING').length,
    preparing: orders.value.filter(order => order.status === 'PREPARING').length,
    ready: orders.value.filter(order => order.status === 'PREPARED').length,
    completed: orders.value.filter(order => order.status === 'SERVED').length
  };
});

const pendingOrders = computed(() => {
  return orders.value.filter(order =>
    order.status === 'PENDING' || order.status === 'PREPARING'
  ).sort((a, b) => new Date(a.time) - new Date(b.time));
});

onMounted(() => {
  fetchOrders();
  setInterval(fetchOrders, 30000);
});

</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
    <Toaster position="top-center" />
    <div class="mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Chef Dashboard</h1>
      <p class="text-sm sm:text-base text-gray-600">Kitchen Operations - {{ new Date().toLocaleDateString() }}</p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
      <div class="stat-card shadow-sm hover:shadow-md transition-shadow">
        <p class="stat-label text-gray-600">New Orders</p>
        <p class="stat-value text-blue-600">{{ stats.newOrders }}</p>
      </div>
      <div class="stat-card shadow-sm hover:shadow-md transition-shadow">
        <p class="stat-label text-gray-600">Preparing</p>
        <p class="stat-value text-orange-600">{{ stats.preparing }}</p>
      </div>
      <div class="stat-card shadow-sm hover:shadow-md transition-shadow">
        <p class="stat-label text-gray-600">Ready to Serve</p>
        <p class="stat-value text-green-600">{{ stats.ready }}</p>
      </div>
      <div class="stat-card shadow-sm hover:shadow-md transition-shadow">
        <p class="stat-label text-gray-600">Completed</p>
        <p class="stat-value text-gray-600">{{ stats.completed }}</p>
      </div>
    </div>
    <div class="section-card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold">Active Orders</h2>
        <span class="badge-count">
          {{ pendingOrders.length }}
        </span>
      </div>
      <div v-if="loading" class="empty-state">
        <div class="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-3">
        </div>
        <p class="text-responsive-base text-gray-600">Loading orders...</p>
      </div>
      <div v-else-if="pendingOrders.length === 0" class="empty-state">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" width="48" height="48" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-responsive-base text-gray-600 font-medium">No pending orders!</p>
        <p class="text-responsive text-gray-500 mt-1">Kitchen is clear.</p>
      </div>
      <div v-else class="space-y-3 sm:space-y-4">
        <div v-for="order in pendingOrders" :key="order.id" class="order-card flex items-center justify-between gap-4">
          <div class="flex-1 min-w-0 space-y-1">
            <p class="font-bold text-sm sm:text-base">Order #{{ order.id }}</p>
            <p class="text-sm text-gray-600">Table: {{ order.tableId }}</p>
            <div class="flex items-center text-xs text-gray-500">
              <svg class="mr-1 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ new Date(order.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
            </div>
          </div>
          <div class="flex flex-col space-y-2 shrink-0">
            <select v-model="order.status" @change="handleStatusChange(order)" :disabled="order.status === 'PREPARED'"
              class="px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              <option value="PENDING" disabled>Pending</option>
              <option value="PREPARING" :disabled="order.status !== 'PENDING'">Preparing</option>
              <option value="PREPARED" :disabled="order.status !== 'PREPARING'">Prepared</option>
            </select>
            <button @click="openOrderDetails(order)"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <OrderDetailsModal :isOpen="isModalOpen" :order="selectedOrder" @close="closeOrderDetails" />
</template>