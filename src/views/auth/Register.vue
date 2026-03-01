<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../../services/authService";
import { toast, Toaster } from "vue-sonner";

const router = useRouter();

const formData = ref({
  email: "",
  phone: "",
  password: "",
  role: "CUSTOMER",
});

const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;

  try {
    await register(formData.value);
    toast.success("Registration successful! Redirecting...");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    toast.error(error?.message || "Registration failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center backgroundColor p-5"
  >
    <Toaster position="top-center" />
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center">
        User <span class="text-blue-500">Registration</span>
      </h1>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="label">Email</label>
          <input
            type="email"
            v-model="formData.email"
            class="input"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="label">Phone</label>
          <input
            type="tel"
            v-model="formData.phone"
            class="input"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label class="label">Password</label>
          <input
            type="password"
            v-model="formData.password"
            class="input"
            placeholder="Enter your password"
          />
        </div>

        <button
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
          :disabled="isLoading"
        >
          {{ isLoading ? "Registering..." : "Register" }}
        </button>
      </form>
      <p class="mt-2 text-center">
        Already have an account?
        <router-link to="/login" class="underline text-blue-500">
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>
