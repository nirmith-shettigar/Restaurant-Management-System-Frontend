<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { login } from "../../services/authService";
import { toast, Toaster } from "vue-sonner";

const router = useRouter();
const store = useStore();

const formData = ref({
  email: "",
  password: "",
  role: "",
});

const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;

  try {
    const response = await login(formData.value);

    await store.dispatch("auth/login", {
      user: response.user,
      token: response.token,
    });

    const roleRoutes = { WAITER: "/waiter", CUSTOMER: "/customer", CHEF: "/chef", MANAGER: "/manager" };
    const destination = roleRoutes[response.user?.role] || "/";

    toast.success("Login successful! Redirecting...");
    setTimeout(() => {
      router.push(destination);
    }, 2000);
  } catch (error) {
    toast.error(error?.message || "Login failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-5">
    <Toaster position="top-center " />
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center">User Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="label">Email</label>
          <input type="email" v-model="formData.email" class="input" placeholder="Enter your email" />
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
          <input type="password" v-model="formData.password" class="input" placeholder="Enter your password" />
        </div>

        <button class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-60 cursor-pointer"
          :disabled="isLoading">
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
