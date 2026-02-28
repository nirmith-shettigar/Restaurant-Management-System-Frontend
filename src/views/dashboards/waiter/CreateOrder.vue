<template>
  <Toaster position="top-center" />
  <div class="max-w-11/12 mx-auto p-6">
    <header class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
      <h1 class="text-2xl font-medium text-gray-800">Create Order</h1>
      <div class="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
        {{ user?.email?.split("@")[0] }} (ID : {{ user?.id }})
      </div>
    </header>

    <div class="mb-8">
      <label for="table-select" class="block mb-2 text-gray-700 font-medium">
        Select Table Number:
      </label>
      <select id="table-select" v-model="selectedTable"
        class="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        :disabled="isLoading">
        <option value="" disabled>Choose a table</option>
        <option v-for="table in availableTables" :key="table" :value="table">
          Table {{ table }}
        </option>
      </select>
    </div>

    <div class="mb-24">
      <h2 class="text-xl font-medium text-gray-800 mb-5">Menu Items</h2>

      <div v-if="!selectedTable" class="text-center py-12 text-gray-400 bg-gray-50 rounded-xl italic">
        Please select a table first
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in menuItems" :key="item.id"
          class="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div class="flex gap-4 flex-1">
            <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
            </div>

            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-800 mb-1">
                {{ item.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-1 line-clamp-2">
                {{ item.description }}
              </p>
              <p class="text-base font-semibold text-green-600">
                ₹{{ item.price }}
              </p>
            </div>
          </div>

          <div class="flex flex-col items-center gap-2 md:flex-row md:gap-3">
            <button @click="decreaseQuantity(item.id)"
              class="w-10 h-10 rounded-full bg-red-400 text-white hover:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center order-1 md:order-1"
              :disabled="getQuantity(item.id) === 0 || isLoading">
              <Minus :size="18" />
            </button>
            <span class="text-lg font-medium text-gray-700 text-center order-2 md:order-2">
              {{ getQuantity(item.id) }}
            </span>
            <button @click="increaseQuantity(item.id)"
              class="w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center order-3 md:order-3"
              :disabled="isLoading">
              <Plus :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasItems"
      class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl bg-white p-5 shadow-lg border-t border-gray-200 rounded-t-xl flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
      <div class="flex gap-6 text-gray-800 font-medium">
        <span>Total Items: {{ totalItems }}</span>
        <span>Total Amount: ₹{{ totalAmount }}</span>
      </div>
      <button @click="submitOrder" :disabled="isLoading"
        class="w-full sm:w-auto px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {{ isLoading ? "Creating..." : "Place Order" }}
      </button>
    </div>

    <div v-if="!hasItems && selectedTable"
      class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl bg-white p-5 shadow-lg border-t border-gray-200 rounded-t-xl flex justify-center">
      <p class="text-gray-500">Add items to place order</p>
    </div>
  </div>
</template>

<script>
import { Plus, Minus } from "lucide-vue-next";
import { ref, reactive, computed, onMounted } from "vue";
import { getMenuItems } from "../../../services/menuService";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { createOrder } from "../../../services/orderService";
import { toast, Toaster } from "vue-sonner";

export default {
  name: "CreateOrder",
  components: {
    Plus,
    Minus,
    Toaster,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.getters["auth/currentUser"]);
    const router = useRouter();

    const selectedTable = ref("");
    const quantities = reactive({});
    const isLoading = ref(false);
    const menuItems = ref([]);

    const availableTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const totalItems = computed(() => {
      return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    });

    const totalAmount = computed(() => {
      return menuItems.value.reduce((sum, item) => {
        return sum + item.price * (quantities[item.id] || 0);
      }, 0);
    });

    const hasItems = computed(() => {
      return totalItems.value > 0;
    });

    const getQuantity = (itemId) => {
      return quantities[itemId] || 0;
    };

    const increaseQuantity = (itemId) => {
      if (!quantities[itemId]) {
        quantities[itemId] = 1;
      } else {
        quantities[itemId]++;
      }
    };

    const decreaseQuantity = (itemId) => {
      if (quantities[itemId] && quantities[itemId] > 0) {
        quantities[itemId]--;
        if (quantities[itemId] === 0) {
          delete quantities[itemId];
        }
      }
    };

    const submitOrder = async () => {
      isLoading.value = true;

      const orderData = {
        tableId: selectedTable.value,
        waiterId: user.value.id,
        time: new Date().toISOString(),
        items: Object.entries(quantities).map(([itemId, quantity]) => ({
          itemId: itemId,
          quantity: quantity,
        })),
      };

      try {
        await createOrder(orderData);
        resetOrder();
        toast.success("Order placed successfully!");
        setTimeout(() => router.push("/waiter"), 2000);
      } catch (error) {
        toast.error(error.message || "Failed to create order");
      } finally {
        isLoading.value = false;
      }
    };

    const resetOrder = () => {
      Object.keys(quantities).forEach((key) => {
        delete quantities[key];
      });
      selectedTable.value = "";
    };

    const fetchMenuItems = async () => {
      try {
        const items = await getMenuItems();
        menuItems.value = items;
      } catch (error) {
        toast.error("Failed to load menu items");
      }
    };

    onMounted(() => {
      fetchMenuItems();
    });

    return {
      availableTables,
      selectedTable,
      menuItems,
      quantities,
      user,
      isLoading,

      totalItems,
      totalAmount,
      hasItems,

      getQuantity,
      increaseQuantity,
      decreaseQuantity,
      submitOrder,
      resetOrder,
    };
  },
};
</script>
