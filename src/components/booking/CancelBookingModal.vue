<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
    >
      <div class="px-6 py-5">
        <p class="text-gray-700 mb-2">
          Are you sure you want to cancel this booking? This action cannot be
          undone.
        </p>
      </div>

      <div class="px-6 pb-5 bg-gray-50 border-gray-200 flex gap-3">
        <button
          @click="closeModal"
          class="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer"
        >
          No, Keep It
        </button>
        <button
          @click="confirmCancel"
          class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium cursor-pointer"
        >
          Yes, Cancel Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => {
  emit("close");
};

const confirmCancel = () => {
  emit("confirm");
};
</script>
