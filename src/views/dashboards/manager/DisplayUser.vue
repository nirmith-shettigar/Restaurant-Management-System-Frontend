<template>
  <div>
    <Toaster position="top-center" />

    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-800">All Users</h2>
        <p class="text-gray-600 mt-2">Manage your staff members</p>
      </div>

      <select
        v-model="selectedRole"
        class="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-pointer hover:border-gray-400"
      >
        <option value="">All Roles</option>
        <option value="CHEF">Chef</option>
        <option value="WAITER">Waiter</option>
        <option value="CUSTOMER">Customer</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="mt-4 text-gray-600">Loading users...</p>
    </div>

    <div
      v-else-if="filterUsers.length === 0"
      class="text-center py-12 bg-white rounded-xl shadow"
    >
      <Users :size="48" class="mx-auto text-gray-400 mb-4" />
      <p class="text-gray-500 text-lg">No users found</p>
      <p class="text-gray-400 text-sm mt-2">
        {{
          selectedRole
            ? "Try changing the filter"
            : "Start by creating a new user"
        }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in filterUsers"
        :key="user.id"
        class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-800 text-lg">
            {{ user.email.split("@")[0] }}
          </h3>
          <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-green-100 text-green-700': user.role === 'CHEF',
              'bg-blue-100 text-blue-700': user.role === 'WAITER',
              'bg-purple-100 text-purple-700': user.role === 'CUSTOMER',
            }"
          >
            {{ user.role }}
          </span>
        </div>

        <div class="space-y-2.5">
          <div class="flex items-center gap-2 text-gray-600 text-sm">
            <Mail :size="16" class="shrink-0 text-gray-400" />
            <span class="truncate">{{ user.email }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 text-sm">
            <Phone :size="16" class="shrink-0 text-gray-400" />
            <span>{{ user.phone }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Users, Mail, Phone } from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import { getUsers } from "../../../services/ManagerService";

const users = ref([]);
const selectedRole = ref("");
const loading = ref(true);

const loadUsers = async () => {
  try {
    loading.value = true;
    users.value = await getUsers();
  } catch (error) {
    toast.error("Failed to load users");
  } finally {
    loading.value = false;
  }
};

const filterUsers = computed(() => {
  return users.value.filter((user) =>
    selectedRole.value ? user.role === selectedRole.value : true,
  );
});

onMounted(() => {
  loadUsers();
});
</script>
