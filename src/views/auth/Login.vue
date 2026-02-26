<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { login } from "../../services/authService";

const router = useRouter();
const store = useStore();

const formData = ref({
  email: "",
  password: "",
  role: "",
});

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  isLoading.value = true;

  try {
    const response = await login(formData.value);

    await store.dispatch("auth/login", {
      user: response.user,
      token: response.token,
    });

    successMessage.value = "Login successful! Redirecting...";

    setTimeout(() => {
      router.push("/");
    }, 2000);
  } catch (error) {
    console.log(error);
    errorMessage.value = error?.message || "Login failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-5">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center">User Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-5">
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
          <label class="label">Role</label>
          <select v-model="formData.role" class="input">
            <option value="" disabled>Select a role</option>
            <option value="CUSTOMER">Customer</option>
            <option value="MANAGER">Manager</option>
            <option value="WAITER">Waiter</option>
            <option value="CHEF">Chef</option>
          </select>
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

        <div
          v-if="errorMessage"
          class="p-3 bg-red-50 border border-red-200 rounded"
        >
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <div
          v-if="successMessage"
          class="p-3 bg-green-50 border border-green-200 rounded"
        >
          <p class="text-sm text-green-600">{{ successMessage }}</p>
        </div>

        <button
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-60"
          :disabled="isLoading"
        >
          {{ isLoading ? "Logging In..." : "Login" }}
        </button>
      </form>
      <p class="mt-2 text-center">
        Don't have an account?
        <router-link to="/register" class="underline text-blue-500">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>
