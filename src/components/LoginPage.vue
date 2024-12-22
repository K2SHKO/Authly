<template>
  <div class="home-container">
    <header class="site-header">
      <h1 class="home-link" @click="$router.push('/')">Authly</h1>
      <nav>
        <button @click="navigateTo('/login')" class="nav-button">Login</button>
        <button @click="navigateTo('/register')" class="nav-button">Sign Up</button>
      </nav>
    </header>

    <main>
      <div class="panel login-panel">
        <h2>Login</h2>
        <input type="text" v-model="loginData.username" placeholder="Username" class="login-input" />
        <input type="password" v-model="loginData.password" placeholder="Password" class="login-input" />
        <button class="action-button" @click="login">Login</button>
        <p class="switch-panel" @click="navigateTo('/register')">Don't have an account? Register</p>
      </div>
    </main>

    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-logo">Authly</div>
        <p class="footer-text">© 2025 Authly. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'LoginPage',
  data() {
    return {
      loginData: {
        username: '',
        password: '',
      },
      ws: null,
    };
  },
  mounted() {
    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === 'success') {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        const user = {
          username: this.loginData.username,
          expiration: expirationDate,
        };

        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(user),
          'authly_secret_key'
        ).toString();

        localStorage.setItem('authlyUser', encryptedData);

        alert('Login successful');
        this.$router.push('/dashboard');
      } else if (response.type === 'error') {
        alert(response.message);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      alert('WebSocket connection error. Please try again later.');
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  },
  methods: {
    login() {
      if (this.loginData.username && this.loginData.password) {
        const payload = {
          type: 'login',
          payload: this.loginData,
        };
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(payload));
        } else {
          alert('WebSocket connection is not established');
        }
      } else {
        alert('Please enter both username and password');
      }
    },
    navigateTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    },
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  },
};
</script>
