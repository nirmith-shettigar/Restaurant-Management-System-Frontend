<template>
  <div class="mt-12">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Today's Bookings</h2>
    <div v-if="loading" class="flex justify-center py-8">
      Loading bookings...
    </div>

    <div
      v-else-if="bookingsWithCustomers.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="booking in bookingsWithCustomers"
        :key="booking.id"
        class="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow"
      >
        <div class="space-y-3">
          <div
            class="flex items-center justify-between border-b border-gray-100 pb-2"
          >
            <h3 class="text-lg font-semibold text-gray-800">
              {{ booking.id }}
            </h3>
            <span
              class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700"
            >
              {{ booking.status }}
            </span>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-700">
              <Mail :size="16" class="text-gray-400" />
              <span class="text-sm">{{ booking.customerEmail }}</span>
            </div>

            <div class="flex items-center gap-2 text-gray-700">
              <Phone :size="16" class="text-gray-400" />
              <span class="text-sm">{{ booking.customerPhone }}</span>
            </div>

            <div class="flex items-center gap-2 text-gray-700">
              <Clock :size="16" class="text-gray-400" />
              <span class="text-sm">{{ formatTime(booking.bookingTime) }}</span>
            </div>

            <div class="flex items-center gap-2 text-gray-700">
              <Users :size="16" class="text-gray-400" />
              <span class="text-sm"
                >{{ booking.numberOfPeople }}
                {{ booking.numberOfPeople > 1 ? "People" : "Person" }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">No bookings for today</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Mail, Phone, Clock, Users } from "lucide-vue-next";
import { getTodayBookings } from "../../services/bookingService";
import { getUserById } from "../../services/userService";
import { formatTime } from "../../utils/timeUtil";

const bookingsWithCustomers = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    const bookings = await getTodayBookings();

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const customer = await getUserById(booking.customerId);
          return {
            ...booking,
            customerEmail: customer.email,
            customerPhone: customer.phone,
          };
        } catch (error) {
          console.error(
            `Error fetching customer ${booking.customerId}:`,
            error,
          );
          return {
            ...booking,
            customerEmail: "N/A",
            customerPhone: "N/A",
          };
        }
      }),
    );

    bookingsWithCustomers.value = bookingsWithDetails;
  } catch (error) {
    console.error("Error loading bookings:", error);
  } finally {
    loading.value = false;
  }
});
</script>
