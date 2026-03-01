<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside
      class="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 w-20 md:w-64 flex flex-col shadow-sm"
    >
      <div class="flex-1 flex flex-col py-4 md:pt-6 mt-14">
        <h1
          class="mb-6 hidden md:block text-2xl text-center font-bold text-gray-800"
        >
          Manager Panel
        </h1>

        <nav class="flex flex-col">
          <router-link
            to="/manager/create-user"
            class="sidebar-link flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition group relative"
          >
            <UserPlus :size="20" />
            <span class="hidden md:inline text-base">Create User</span>
          </router-link>

          <router-link
            to="/manager/users"
            class="sidebar-link flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 transition group relative"
          >
            <Users :size="20" />
            <span class="hidden md:inline text-base">All Users</span>
          </router-link>
        </nav>
      </div>

      <div class="p-4 text-xs text-gray-500 text-center hidden md:block">
        © 2026 Manager Panel
      </div>
    </aside>

    <main class="flex-1 ml-18 md:ml-64 p-4 md:p-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { UserPlus, Users } from "lucide-vue-next";
</script>

<style scoped>
.sidebar-link.router-link-active {
  background-color: rgb(219 234 254);
  color: #1e40af;
  border-right: 4px solid #2563eb;
  padding-right: 5px;
}

.sidebar-link.router-link-active svg {
  color: #2563eb;
}
</style>
