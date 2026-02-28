<template>
  <div class="mt-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">My Upcoming Bookings</h2>

    <div v-if="loading" class="flex justify-center py-8">
      Loading bookings...
    </div>

    <div v-else-if="bookings.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="booking in bookings" :key="booking.id"
        class="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-5 border border-gray-100">
        <div class="space-y-2">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Hash :size="18" class="text-gray-400" />
              {{ "BOOKING : " + booking.id }}
            </h3>
            <span class="px-3 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(booking.status)">
              {{ booking.status }}
            </span>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2 text-gray-700">
              <Calendar :size="18" class="text-purple-500" />
              <span class="text-sm font-medium">{{
                formatDate(booking.bookingTime)
                }}</span>
            </div>

            <div class="flex items-center gap-2 text-gray-700">
              <Clock :size="18" class="text-purple-500" />
              <span class="text-sm font-medium">{{
                formatTime(booking.bookingTime)
                }}</span>
            </div>

            <div class="flex items-center gap-2 text-gray-700">
              <Users :size="18" class="text-purple-500" />
              <span class="text-sm font-medium">
                {{ booking.numberOfPeople }}
                {{ booking.numberOfPeople > 1 ? "People" : "Person" }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="handleEdit(booking)"
              class="flex-1 px-3 py-2 text-black rounded-lg shadow-md ring-1 text-sm font-medium flex items-center justify-center gap-1 cursor-pointer">
              <Edit2 :size="16" />
              Edit
            </button>
            <button @click="handleCancel(booking.id)"
              class="flex-1 px-3 py-2 bg-black text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 cursor-pointer">
              <Trash2 :size="16" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 bg-gray-50 rounded-xl">
      <CalendarX :size="48" class="mx-auto text-gray-400 mb-3" />
      <p class="text-gray-500">No upcoming bookings</p>
      <p class="text-sm text-gray-400 mt-1">
        Book a table to see your reservations here
      </p>
    </div>

    <CancelBookingModal :isOpen="showCancelModal" :bookingId="bookingToCancel" @close="closeCancelModal"
      @confirm="confirmCancel" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Calendar,
  Clock,
  Users,
  Edit2,
  Trash2,
  Hash,
  CalendarX,
} from "lucide-vue-next";
import { formatTime } from "../../utils/timeUtil";
import { formatDate } from "../../utils/timeUtil";
import CancelBookingModal from "./CancelBookingModal.vue";

const props = defineProps({
  bookings: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["edit", "cancel"]);

const showCancelModal = ref(false);
const bookingToCancel = ref(null);

const getStatusClass = (status) => {
  const classes = {
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return classes[status];
};

const handleEdit = (booking) => {
  emit("edit", booking);
};

const handleCancel = (bookingId) => {
  bookingToCancel.value = bookingId;
  showCancelModal.value = true;
};

const closeCancelModal = () => {
  showCancelModal.value = false;
  bookingToCancel.value = null;
};

const confirmCancel = () => {
  emit("cancel", bookingToCancel.value);
  closeCancelModal();
};
</script>
