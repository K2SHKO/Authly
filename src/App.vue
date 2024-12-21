<template>
  <div id="app">
    <nav>
      Authly
    </nav>
    <router-view />
    <footer>
      <div class="footer-content">
        <p>&copy; 2023 Authly. All rights reserved.</p>
        <p class="powered-by">Powered by Vue.js</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style src="./assets/style.css"></style>