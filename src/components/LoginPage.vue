<template>
    <main>
      <div class="panel">
        <h2>Login</h2>
        <input type="text" v-model="loginData.username" placeholder="Username">
        <input type="password" v-model="loginData.password" placeholder="Password">
        <button class="action-button" @click="login">Login</button>
        <p class="switch-panel" @click="$router.push('/register')">Don't have an account? Register</p>
      </div>
    </main>
  </template>
  
  <script>
  export default {
    name: 'LoginPage',
    data() {
      return {
        loginData: {
          username: '',
          password: '',
        },
      };
    },
    methods: {
      login() {
        if (this.loginData.username && this.loginData.password) {
          alert('Login successful');
          this.$router.push('/dashboard');
        } else {
          alert('Invalid username or password');
        }
      },
    },
  };
  </script>