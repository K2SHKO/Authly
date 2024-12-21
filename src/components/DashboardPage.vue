<template>
  <div class="dashboard">
  <header class="site-header">
    <h1 class="home-link" @click="$router.push('/')">Authly</h1>
    <nav>
      <div class="greeting">
        {{ greetingMessage }}, {{ loggedInUsername }}!
      </div>
      <button class="logout-button" @click="logout">Logout</button>
    </nav>
  </header>

    <div class="main-section">
      <aside class="sidebar">
        <ul>
    <li 
        @click="navigate('Licenses')" 
        :class="{ active: currentPage === 'Licenses' }" 
        class="menu-item"
    >
        <img src="../assets/svg/key-svgrepo-com.svg" alt="Licenses Icon" class="icon" />
        Licenses
    </li>
    <li 
        @click="navigate('Users')" 
        :class="{ active: currentPage === 'Users' }" 
        class="menu-item"
    >
        <img src="../assets/svg/user-alt-1-svgrepo-com.svg" alt="Users Icon" class="icon" />
        Users
    </li>
    <li 
        @click="navigate('Webhooks')" 
        :class="{ active: currentPage === 'Webhooks' }" 
        class="menu-item"
    >
        <img src="../assets/svg/figma-svgrepo-com.svg" alt="Webhooks Icon" class="icon" />
        Webhooks
    </li>
    <li 
        @click="navigate('Files')" 
        :class="{ active: currentPage === 'Files' }" 
        class="menu-item"
    >
        <img src="../assets/svg/files-alt-svgrepo-com.svg" alt="Files Icon" class="icon" />
        Files
    </li>
    <li 
        @click="navigate('settings')" 
        :class="{ active: currentPage === 'settings' }" 
        class="menu-item"
    >
        <img src="../assets/svg/settings-svgrepo-com.svg" alt="Settings Icon" class="icon" />
        Settings
    </li>
</ul>
      </aside>

      <section class="content">
        <component :is="currentPageComponent"></component>
      </section>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";

export default {
  name: "DashboardPage",
  data() {
    return {
      loggedInUsername: "",
      currentPage: "home",
    };
  },
  components: {
    home: {
      template: `<div><h2>Welcome to the Dashboard!</h2><p>This is your personalized space.</p></div>`,
    },
    settings: {
      template: `<div><h2>Settings</h2><p>Update your preferences here.</p></div>`,
    },
  },
  computed: {
    currentPageComponent() {
      return this.currentPage;
    },
    greetingMessage() {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 6) return "Good night";
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    },
  },
  mounted() {
    const storedUser = localStorage.getItem("authlyUser");
    if (storedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(storedUser, "authly_secret_key");
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (new Date(decryptedData.expiration) > new Date() && decryptedData.username) {
          this.loggedInUsername = decryptedData.username;
        } else {
          localStorage.removeItem("authlyUser");
          this.$router.push("/login");
        }
      } catch (error) {
        console.error("Failed to decrypt user data:", error);
        localStorage.removeItem("authlyUser");
        this.$router.push("/login");
      }
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    navigate(page) {
      this.currentPage = page;
    },
    logout() {
      localStorage.removeItem("authlyUser");
      alert("Logged out successfully");
      this.$router.push("/");
    },
  },
};
</script>

<style src="../assets/dashboard.css"></style>
