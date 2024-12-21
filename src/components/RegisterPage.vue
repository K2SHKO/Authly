<template>
    <main>
      <div class="panel">
        <h2>Register</h2>
        <input type="text" v-model="registerData.username" placeholder="Username">
        <input type="password" v-model="registerData.password" placeholder="Password">
        <input type="email" v-model="registerData.email" placeholder="Email">
        <button class="action-button" @click="register">Register</button>
        <p class="switch-panel" @click="$router.push('/login')">Already have an account? Login</p>
      </div>
    </main>
  </template>
  
  <script>
  export default {
    name: 'RegisterPage',
    data() {
      return {
        registerData: {
          username: '',
          password: '',
          email: '',
        },
      };
    },
    methods: {
      register() {
        if (this.registerData.username && this.registerData.password && this.registerData.email) {
          alert('Registration successful');
          this.$router.push('/login');
        } else {
          alert('Please fill out all fields');
        }
      },
    },
  };
  </script>