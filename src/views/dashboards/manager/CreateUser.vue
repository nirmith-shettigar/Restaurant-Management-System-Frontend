<template>
  <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-black">Create User</h2>

    <form @submit.prevent="AddUser" class="space-y-4">
      <input v-model="name" placeholder="Name" required
        class="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />

      <input v-model="email" type="email" placeholder="Email" required
        class="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />

      <input v-model="phone" placeholder="Phone number" required
        class="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />

      <input v-model="password" type="password" placeholder="Password" required
        class="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />

      <div class="flex gap-6">
        <label class="flex items-center gap-2">
          <input type="radio" value="waiter" v-model="role" />
          Waiter
        </label>

        <label class="flex items-center gap-2">
          <input type="radio" value="chef" v-model="role" />
          Chef
        </label>
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
        Add User
      </button>
    </form>
  </div>
</template>

<script>
import ManagerService from '../../../services/ManagerService';

export default {
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: "waiter"
    }
  },

  methods: {
    AddUser() {
      ManagerService.addUser({
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.password,
        role: this.role
      }).then((res) => this.$router.push("/manager/users"))
      alert("Created User Succesfully")
    }
  }
}
</script>