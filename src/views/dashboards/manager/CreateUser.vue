<template>
  <div class="max-w-2xl mx-auto">
    <Toaster position="top-center" />

    <div class="mb-6 ml-3 md:ml-0">
      <h2 class="text-3xl font-bold text-gray-800">Create User</h2>
      <p class="text-gray-600 mt-2">Add new staff member to the system</p>
    </div>

    <div class="bg-white p-6 md:p-8 rounded-xl shadow">
      <form @submit.prevent="addUserToUserList" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter email address"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter password"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              v-model="phone"
              placeholder="Enter 10-digit phone number"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              maxlength="10"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              v-model="role"
              required
              class="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-pointer hover:border-gray-400"
            >
              <option value="WAITER">Waiter</option>
              <option value="CHEF">Chef</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          <span v-if="!loading">Create User</span>
          <span v-else>Creating...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast, Toaster } from "vue-sonner";
import { register } from "../../../services/authService";

const router = useRouter();

const email = ref("");
const phone = ref("");
const password = ref("");
const role = ref("WAITER");
const loading = ref(false);

const addUserToUserList = async () => {
  loading.value = true;

  try {
    await register({
      email: email.value,
      phone: phone.value,
      password: password.value,
      role: role.value,
    });

    toast.success("User created successfully!");
    setTimeout(() => {
      router.push("/manager/users");
    }, 2000);
  } catch (error) {
    toast.error(error.message || "Failed to create user");
  } finally {
    loading.value = false;
  }
};
</script>
