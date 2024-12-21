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
  export default {
    name: 'DashboardPage',
    data() {
      return {
        loggedInUsername: 'User',
      };
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
        alert('Logged out successfully');
        this.$router.push('/');
      },
    },
  };
  </script>