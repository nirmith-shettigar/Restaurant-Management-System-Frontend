<template>
  <div>
    <h2 class="text-2xl font-bold mb-8">All Users</h2>

    <div class="overflow-x-auto bg-white rounded-xl shadow-md">
      <table class="min-w-full text-left">


        <thead class="bg-slate-800 text-white">
          <tr>
            <th class="px-6 py-4">Name</th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4">Phone</th>
            <th class="px-6 py-4">Role</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-50 transition">
            <td class="px-6 py-4 font-medium">
              {{ user.name }}
            </td>

            <td class="px-6 py-4 text-gray-600">
              {{ user.email }}
            </td>

            <td class="px-6 py-4 text-gray-600">
              {{ user.phone }}
            </td>

            <td class="px-6 py-4">
              <span class="px-3 py-1 rounded-full text-sm font-medium" :class="user.role === 'chef'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'">
                {{ user.role }}
              </span>
            </td>
          </tr>


          <tr v-if="users.length === 0">
            <td colspan="4" class="text-center py-6 text-gray-500">
              No users found
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ManagerService from '../../../services/ManagerService';

export default {
  data() {
    return {
      users: []
    }
  },

  mounted() {
    this.loadUsers()
  },

  methods: {
    loadUsers() {
      ManagerService.getUsers().then((res) => this.users = res.data)
    }
  }
}
</script>