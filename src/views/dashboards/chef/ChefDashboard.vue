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
  <div class="p-4">
    <div class="mb-4">
      <h1 class="text-2xl font-bold mb-2">Chef Dashboard</h1>
      <p>Kitchen Operations - {{ new Date().toLocaleDateString() }}</p>
    </div>

    <div class="flex gap-4 mb-4">
      <div class="stat-card">
        <p class="stat-label">New Orders</p>
        <p class="stat-value">{{ stats.newOrders }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Preparing</p>
        <p class="stat-value">{{ stats.preparing }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Ready to Serve</p>
        <p class="stat-value">{{ stats.ready }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Completed</p>
        <p class="stat-value">{{ stats.completed }}</p>
      </div>
    </div>

    <div class="bg-white border p-4">
      <h2 class="text-xl font-bold mb-4">Active Orders ({{ pendingOrders.length }})</h2>

      <div v-if="loading" class="text-center py-8">
        <p>Loading orders...</p>
      </div>

      <div v-else-if="pendingOrders.length === 0" class="text-center py-8">
        <p>No pending orders! Kitchen is clear.</p>
      </div>

      <div v-else>
        <div v-for="order in pendingOrders.slice(0, 5)" :key="order.id" class="border-b py-3">
          <div class="mb-2">
            <span class="font-bold">Order #{{ order.id }}</span> |
            <span>Table {{ order.tableId }}</span> |
            <span class="text-sm border px-2 py-1">{{ order.status }}</span>
          </div>
          <div class="text-sm mb-1">
            <span class="font-bold">Items:</span>
            {{order.items?.map(item => `${item.name} (x${item.quantity})`).join(', ') || 'No items'}}
          </div>
          <div class="text-sm">
            {{ new Date(order.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>