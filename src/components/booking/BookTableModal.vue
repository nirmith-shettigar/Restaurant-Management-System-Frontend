<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
    >
      <div class="px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarPlus :size="24" />
          {{ isEdit ? "Edit Booking" : "Book a Table" }}
        </h2>
      </div>

      <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <Users :size="16" class="inline mr-1" />
            Number of People
          </label>
          <input
            v-model.number="formData.numberOfPeople"
            type="number"
            min="1"
            max="20"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter number of people"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <Calendar :size="16" class="inline mr-1" />
            Booking Date
          </label>
          <input
            v-model="formData.date"
            type="date"
            :min="minDate"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <Clock :size="16" class="inline mr-1" />
            Booking Time
          </label>
          <input
            v-model="formData.time"
            type="time"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm">
          {{ errorMessage }}
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:bg-purple-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ isLoading ? "Processing..." : isEdit ? "Update" : "Book Table" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { CalendarPlus, Users, Calendar, Clock } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  booking: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const formData = ref({
  numberOfPeople: 2,
  date: "",
  time: "",
});

const isLoading = ref(false);
const errorMessage = ref("");

const isEdit = computed(() => !!props.booking);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

const closeModal = () => {
  resetForm();
  emit("close");
};

const resetForm = () => {
  formData.value = {
    numberOfPeople: 2,
    date: "",
    time: "",
  };
  errorMessage.value = "";
  isLoading.value = false;
};

const handleSubmit = async () => {
  errorMessage.value = "";

  const selectedDateTime = new Date(
    `${formData.value.date}T${formData.value.time}`,
  );

  const now = new Date();

  if (selectedDateTime < now) {
    errorMessage.value = "Booking date and time cannot be in the past";
    return;
  }

  isLoading.value = true;

  try {
    const bookingData = {
      numberOfPeople: formData.value.numberOfPeople,
      bookingTime: selectedDateTime.toISOString(),
    };

    emit("submit", bookingData);
    closeModal();
  } catch (error) {
    errorMessage.value = "Failed to process booking. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.booking) {
      const bookingDate = new Date(props.booking.bookingTime);
      formData.value = {
        numberOfPeople: props.booking.numberOfPeople,
        date: bookingDate.toISOString().split("T")[0],
        time: bookingDate.toTimeString().slice(0, 5),
      };
    } else if (!newValue) {
      resetForm();
    }
  },
);
</script>
