<template>
  <div class="min-h-screen bg-gray-50">
    <Toaster position="top-center" />
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
        <p class="text-gray-600 mt-2">Book tables and view menu</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          @click="openBookingModal"
          class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <CalendarPlus :size="24" class="text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Book Table</h3>
              <p class="text-sm text-gray-600">Reserve a table</p>
            </div>
          </div>
        </div>

        <router-link
          to="/customer/menu"
          class="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
            >
              <UtensilsCrossed :size="24" class="text-orange-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">View Menu</h3>
              <p class="text-sm text-gray-600">Browse our menu</p>
            </div>
          </div>
        </router-link>
      </div>

      <CustomerBookingsList
        :bookings="bookings"
        :loading="loading"
        @edit="openEditModal"
        @cancel="handleCancelBooking"
      />

      <BookTableModal
        :isOpen="isModalOpen"
        :booking="selectedBooking"
        @close="closeModal"
        @submit="handleBookingSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { CalendarPlus, UtensilsCrossed } from "lucide-vue-next";
import CustomerBookingsList from "../../../components/booking/CustomerBookingsList.vue";
import BookTableModal from "../../../components/booking/BookTableModal.vue";
import {
  getUpcomingBookingsByCustomerId,
  createBooking,
  updateBooking,
  cancelBooking,
} from "../../../services/bookingService";
import { toast, Toaster } from "vue-sonner";

const store = useStore();

const bookings = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const selectedBooking = ref(null);

const currentUser = computed(() => store.getters["auth/currentUser"]);

const loadBookings = async () => {
  try {
    loading.value = true;
    const customerId = currentUser.value?.id;
    if (customerId) {
      const data = await getUpcomingBookingsByCustomerId(customerId);
      bookings.value = data;
    }
  } catch (error) {
    toast.error(error.message || "Error loading bookings");
  } finally {
    loading.value = false;
  }
};

const openBookingModal = () => {
  selectedBooking.value = null;
  isModalOpen.value = true;
};

const openEditModal = (booking) => {
  selectedBooking.value = booking;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedBooking.value = null;
};

const handleBookingSubmit = async (bookingData) => {
  try {
    if (selectedBooking.value) {
      await updateBooking(selectedBooking.value.id, bookingData);
    } else {
      await createBooking({
        ...bookingData,
        customerId: currentUser.value?.id,
      });
    }

    toast.success("Booking successful!");
    await loadBookings();
  } catch (error) {
    toast.error(error.message || "Error submitting booking");
  }
};

const handleCancelBooking = async (bookingId) => {
  try {
    await cancelBooking(bookingId);
    toast.success("Booking cancelled successfully!");
    await loadBookings();
  } catch (error) {
    toast.error(error.message || "Error cancelling booking");
  }
};

onMounted(async () => {
  await loadBookings();
});
</script>
