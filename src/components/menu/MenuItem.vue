<template>
  <div
    class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 flex gap-4"
  >
    <div class="flex gap-4 flex-1">
      <div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
        <img
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="flex flex-col justify-center flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">
          {{ item.name }}
        </h3>
        <p class="text-sm text-gray-600 line-clamp-2">{{ item.description }}</p>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <p class="text-2xl font-bold text-green-600">₹{{ item.price }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
