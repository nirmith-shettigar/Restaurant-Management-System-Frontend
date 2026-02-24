<template>
  <nav class="shadow-md bg-white text-black sticky top-0 z-50">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-15">
        <!-- Left: Logo and Name -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            Logo
          </router-link>
        </div>

        <!-- Right: Login and Register Buttons -->
        <div class="flex items-center space-x-4">
          <router-link
            to="/login"
            class="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition duration-200"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            Register
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>
