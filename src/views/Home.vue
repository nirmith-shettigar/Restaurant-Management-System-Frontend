<template>
  <div class="flex flex-col min-h-screen">
    <main class="py-8 lg:py-8 md:py-24">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="flex flex-col justify-center pl-4">
            <h1
              class="text-4xl text-center md:text-left md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6"
            >
              Welcome to <span class="text-blue-600">Mealio</span>
            </h1>
            <p
              class="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed text-center md:text-left"
            >
              Streamline your restaurant operations with our comprehensive
              management system. From table bookings to order management, we've
              got you covered.
            </p>
            <div
              class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <router-link
                to="/customer"
                class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center"
              >
                Get Started
              </router-link>
              <router-link
                to="/login"
                class="px-8 py-3 bg-black text-white border-2 rounded-lg transition font-medium text-center"
              >
                Login
              </router-link>
            </div>
          </div>

          <div class="flex justify-center items-center">
            <img
              :src="ChefImage"
              alt="Restaurant Management"
              class="w-full h-auto md:scale-125 lg:scale-95 object-cover"
            />
          </div>
        </div>
      </div>
    </main>

    <footer class="text-gray-400 border-t py-4 mt-auto">
      <p class="text-center">&copy; 2026 Mealio. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import ChefImage from "../assets/landing-page.jpg";
</script>
