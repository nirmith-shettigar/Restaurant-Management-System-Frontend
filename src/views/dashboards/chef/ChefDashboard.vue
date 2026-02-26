<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllOrders } from '../../../services/orderService';

const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  try {
    loading.value = true;
    const data = await getAllOrders();
    orders.value = data;
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

const stats = computed(() => {
  return {
    newOrders: orders.value.filter(order => order.status === 'placed').length,
    preparing: orders.value.filter(order => order.status === 'preparing').length,
    ready: orders.value.filter(order => order.status === 'ready').length,
    completed: orders.value.filter(order => order.status === 'served').length
  };
});

const pendingOrders = computed(() => {
  return orders.value.filter(order =>
    order.status === 'placed' || order.status === 'preparing'
  ).sort((a, b) => new Date(a.time) - new Date(b.time));
});

onMounted(() => {
  fetchOrders();
  setInterval(fetchOrders, 30000);
});

</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
    <!-- Header Section -->
    <div class="mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Chef Dashboard</h1>
      <p class="text-sm sm:text-base text-gray-600">Kitchen Operations - {{ new Date().toLocaleDateString() }}</p>
    </div>

    <!-- Stats Grid - Mobile Optimized -->
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

    <!-- Active Orders Section -->
    <div class="section-card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold">Active Orders</h2>
        <span class="badge-count">
          {{ pendingOrders.length }}
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="empty-state">
        <div class="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-3">
        </div>
        <p class="text-responsive-base text-gray-600">Loading orders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="pendingOrders.length === 0" class="empty-state">
        <svg class="mx-auto icon-lg text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-responsive-base text-gray-600 font-medium">No pending orders!</p>
        <p class="text-responsive text-gray-500 mt-1">Kitchen is clear.</p>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-3 sm:space-y-4">
        <div v-for="order in pendingOrders.slice(0, 5)" :key="order.id" class="order-card">
          <!-- Order Header -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="font-bold text-sm sm:text-base">Order #{{ order.id }}</span>
            <span class="text-gray-400 hidden sm:inline">|</span>
            <span class="chip">Table {{ order.tableId }}</span>
            <span class="badge ml-auto" :class="{
              'status-placed': order.status === 'placed',
              'status-preparing': order.status === 'preparing',
              'status-ready': order.status === 'ready'
            }">
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>

          <!-- Order Items -->
          <div class="mb-2 sm:mb-3">
            <span class="font-semibold text-responsive text-gray-700 block mb-1">Items:</span>
            <div class="flex flex-wrap gap-1 sm:gap-2">
              <span v-for="(item, index) in order.items" :key="index" class="chip">
                {{ item.name }} <span class="font-semibold text-blue-600">×{{ item.quantity }}</span>
              </span>
              <span v-if="!order.items || order.items.length === 0" class="text-responsive text-gray-500 italic">
                No items
              </span>
            </div>
          </div>

          <!-- Order Time -->
          <div class="flex items-center text-responsive text-gray-600">
            <svg class="icon-sm mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ new Date(order.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
          </div>
        </div>

        <!-- Show More Indicator -->
        <div v-if="pendingOrders.length > 5" class="text-center pt-2">
          <p class="text-responsive text-gray-500">
            Showing 5 of {{ pendingOrders.length }} orders
          </p>
        </div>
      </div>
    </div>
  </div>
</template>