<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="mb-8 flex justify-center">
        <div
          class="size-24 bg-blue-100 rounded-full flex items-center justify-center"
        >
          <AlertCircle :size="48" class="text-blue-600" />
        </div>
      </div>
      <h1 class="text-8xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft :size="20" />
          Go Back
        </button>
        <router-link
          to="/"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
        >
          <Home :size="20" />
          Home Page
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { AlertCircle, ArrowLeft, Home } from "lucide-vue-next";

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};
</script>
