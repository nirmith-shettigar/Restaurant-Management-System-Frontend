<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-scroll-hidden flex flex-col"
    >
      <h2
        class="px-6 py-4 text-xl font-semibold text-gray-800 flex items-center gap-2"
      >
        <FileText :size="24" />
        Order Details
      </h2>

      <div class="px-6 py-5 overflow-y-auto max-h-[calc(90vh-80px)]">
        <div v-if="loading" class="flex justify-center py-8">Loading...</div>

        <div v-else class="space-y-5">
          <div class="space-y-3">
            <div class="flex items-center gap-3 text-gray-700">
              <Hash :size="18" class="text-gray-400" />
              <span class="text-sm font-medium text-gray-500">Order ID:</span>
              <span class="font-semibold">{{ order.id }}</span>
            </div>

            <div class="flex items-center gap-3 text-gray-700">
              <Users :size="18" class="text-gray-400" />
              <span class="text-sm font-medium text-gray-500">Table:</span>
              <span class="font-semibold">{{ order.tableId }}</span>
            </div>

            <div class="flex items-center gap-3 text-gray-700">
              <User :size="18" class="text-gray-400" />
              <span class="text-sm font-medium text-gray-500">Waiter ID:</span>
              <span class="font-semibold">{{ order.waiterId }}</span>
            </div>

            <div class="flex items-center gap-3 text-gray-700">
              <Clock :size="18" class="text-gray-400" />
              <span class="text-sm font-medium text-gray-500">Time:</span>
              <span class="font-semibold">{{ formatTime(order.time) }}</span>
            </div>

            <div class="flex items-center gap-3 text-gray-700">
              <Package :size="18" class="text-gray-400" />
              <span class="text-sm font-medium text-gray-500">Status:</span>
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="getStatusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </div>
          </div>

          <div class="border-t border-gray-200"></div>

          <div>
            <h3
              class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"
            >
              <ShoppingBag :size="20" />
              Items Ordered
            </h3>

            <div class="space-y-2">
              <div
                v-for="item in orderItemsWithDetails"
                :key="item.itemId"
                class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-blue-600 font-semibold text-sm">
                      {{ item.quantity }}x
                    </span>
                  </div>
                  <span class="text-gray-800 font-medium">{{ item.name }}</span>
                </div>
                <span class="text-gray-600 font-semibold"
                  >₹{{ item.price * item.quantity }}</span
                >
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-800"
                >Total Amount</span
              >
              <span class="text-xl font-bold text-blue-600"
                >₹{{ totalAmount }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 rounded-2xl bg-gray-50 border-t border-gray-200">
        <button
          @click="closeModal"
          class="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  FileText,
  Hash,
  Users,
  User,
  Clock,
  Package,
  ShoppingBag,
} from "lucide-vue-next";
import { getMenuItems } from "../../services/menuService";
import { formatTime } from "../../utils/timeUtil";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const loading = ref(false);
const menuItems = ref([]);

const closeModal = () => {
  emit("close");
};

const orderItemsWithDetails = computed(() => {
  if (!props.order.items || !menuItems.value.length) return [];

  return props.order.items.map((item) => {
    const menuItem = menuItems.value.find((mi) => mi.id === item.itemId);
    return {
      itemId: item.itemId,
      quantity: item.quantity,
      name: menuItem?.name,
      price: menuItem?.price,
    };
  });
});

const totalAmount = computed(() => {
  return orderItemsWithDetails.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
});

const getStatusClass = (status) => {
  const classes = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PREPARING: "bg-orange-100 text-orange-700",
    PREPARED: "bg-blue-100 text-blue-700",
    SERVED: "bg-green-100 text-green-700",
  };

  return classes[status];
};

watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      loading.value = true;
      try {
        menuItems.value = await getMenuItems();
      } catch (error) {
        console.error("Error loading menu items:", error);
      } finally {
        loading.value = false;
      }
    }
  },
);
</script>
