<template>
    <main class="dashboard">
      <aside class="sidebar">
        <ul>
          <li>Home</li>
          <li>Settings</li>
        </ul>
      </aside>
      <section class="content">
        <div class="top-bar">
          <h1>{{ greetingMessage }}, {{ loggedInUsername }}!</h1>
          <button class="logout-button" @click="logout">Logout</button>
        </div>
        <div class="main-content">
          <h2>Welcome to your dashboard</h2>
          <p>This is your personalized space.</p>
        </div>
      </section>
    </main>
  </template>
  
  <script>
  import CryptoJS from 'crypto-js';
  
  export default {
    name: 'DashboardPage',
    data() {
      return {
        loggedInUsername: '',
      };
    },
    mounted() {
      const storedUser = localStorage.getItem('authlyUser');
      if (storedUser) {
        try {
          const bytes = CryptoJS.AES.decrypt(storedUser, 'authly_secret_key');
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          if (new Date(decryptedData.expiration) > new Date() && decryptedData.username) {
            this.loggedInUsername = decryptedData.username;
          } else {
            localStorage.removeItem('authlyUser');
            this.$router.push('/login');
          }
        } catch (error) {
          console.error('Failed to decrypt user data:', error);
          localStorage.removeItem('authlyUser');
          this.$router.push('/login');
        }
      } else {
        this.$router.push('/login');
      }
    },
    computed: {
      greetingMessage() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
      },
    },
    methods: {
      logout() {
        localStorage.removeItem('authlyUser');
        alert('Logged out successfully');
        this.$router.push('/');
      },
    },
  };
  </script>

