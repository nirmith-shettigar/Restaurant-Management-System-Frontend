<script>
import Navbar from './components/common/Navbar.vue';

export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>

<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>
