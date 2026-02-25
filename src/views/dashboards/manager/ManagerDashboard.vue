<template>
  <div class="flex h-screen w-screen bg-gray-100">


    <div class="w-1/2 bg-slate-900 text-white p-10 flex flex-col justify-between fixed left-0 top-10 h-screen">

      <div>
        <h1 class="text-3xl font-bold mb-12">
          Manager Dashboard
        </h1>

        <nav class="flex flex-col space-y-4">
          <router-link 
            to="/manager/create-user"
            class="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-lg">
            Create Users
          </router-link>

          <router-link 
            to="/manager/users"
            class="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-lg">
            View All Users
          </router-link>
        </nav>
      </div>

      <div class="text-sm text-gray-400">
        © 2026 Manager Panel
      </div>

    </div>

    <div class="ml-[50%] w-1/2 h-screen p-12 overflow-y-auto bg-white">
      <router-view />
    </div>

  </div>
</template>

<script>
export default {}
</script>