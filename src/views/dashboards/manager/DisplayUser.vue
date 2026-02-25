<template>
  <div>
    <h2 class="text-2xl font-bold mb-8">All Users</h2>

    <div class="flex flex-wrap gap-6">
      <div v-for="user in users" :key="user.id"
        class="w-56 bg-white p-6 rounded-xl shadow-md text-center">

        <div class="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>

        <h3 class="font-semibold text-lg">{{ user.name }}</h3>
        <p class="text-gray-600">{{ user.email }}</p>
        <span class="text-blue-600">Role : {{ user.role }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ManagerService from '../../../services/ManagerService';

export default {
  data(){
    return {  
      users:[]
    }
  },

  mounted(){
    this.loadUsers()
  },

  methods:{
    loadUsers(){
      ManagerService.getUsers().then((res)=>this.users=res.data)
    }
  }
}
</script>