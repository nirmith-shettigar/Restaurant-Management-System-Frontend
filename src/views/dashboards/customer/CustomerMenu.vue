<template>
  <div class="min-h-screen bg-gray-50">
    <Toaster position="top-center" />
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Our Menu</h1>
          <p class="text-gray-600 mt-2">Discover our delicious offerings</p>
        </div>
        <router-link
          to="/customer"
          class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 font-medium"
        >
          <ArrowLeft :size="20" />
          Back to Dashboard
        </router-link>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        Loading menu items...
      </div>

      <div
        v-else-if="menuItems.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <MenuItem v-for="item in menuItems" :key="item.id" :item="item" />
      </div>

      <div v-else class="text-center py-12 bg-white rounded-xl shadow">
        <UtensilsCrossed :size="48" class="mx-auto text-gray-400 mb-3" />
        <p class="text-gray-500">No menu items available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ArrowLeft, UtensilsCrossed } from "lucide-vue-next";
import MenuItem from "../../../components/menu/MenuItem.vue";
import { getMenuItems } from "../../../services/menuService";
import { toast, Toaster } from "vue-sonner";

const menuItems = ref([]);
const loading = ref(true);

const loadMenuItems = async () => {
  try {
    loading.value = true;
    const items = await getMenuItems();
    menuItems.value = items;
  } catch (error) {
    toast.error("Error loading menu items:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadMenuItems();
});
</script>
