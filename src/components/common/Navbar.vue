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

        <!-- Right: Login and Register Buttons OR Profile Icon -->
        <div class="flex items-center space-x-4">
          <template v-if="!isAuthenticated">
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
          </template>

          <template v-else>
            <div class="relative" @click="showDropdown = !showDropdown">
              <div
                class="size-10 rounded-full flex items-center justify-center cursor-pointer border border-gray-500"
              >
                <User :size="20" />
              </div>

              <div
                v-if="showDropdown"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <button
                  class="w-full text-left px-4 py-3 rounded-t-lg hover:bg-gray-200 transition flex items-center space-x-2"
                >
                  <User :size="16" class="text-gray-600" />
                  <span class="text-gray-700">Profile</span>
                </button>
                <button
                 @click="handleLogout"
                  class="w-full text-left px-4 py-3 rounded-b-lg hover:bg-red-500 group transition flex items-center space-x-2"
                >
                  <LogOut
                    :size="16"
                    class="text-gray-600 group-hover:text-white"
                  />
                  <span class="text-gray-700 group-hover:text-white"
                    >Logout</span
                  >
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { User, LogOut } from "lucide-vue-next";

const store = useStore();
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);
const showDropdown = ref(false);

const handleLogout = () => {
  store.dispatch("auth/logout");
  showDropdown.value = false;
};
</script>
