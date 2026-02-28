<script>
import Navbar from './components/common/Navbar.vue';
import "vue-sonner/style.css";

export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>

<template>
  <div id="app">
    <Navbar v-if="!$route.meta.hideNavbar" />
    <main>
      <router-view />
    </main>
  </div>
</template>
