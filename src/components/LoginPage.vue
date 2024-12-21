<template>
  <div class="home-container">
  
    <header class="site-header">
      <h1 class="home-link" @click="$router.push('/')">Authly</h1>
      <nav>
        <button @click="handleLoginClick" class="nav-button">Login</button>
        <button @click="$router.push('/register')" class="nav-button">Sign Up</button>
      </nav>
    </header>

  <main>
    <div class="panel login-panel">
      <h2>Login</h2>
      <input type="text" v-model="loginData.username" placeholder="Username" class="login-input">
      <input type="password" v-model="loginData.password" placeholder="Password" class="login-input">
      <button class="action-button" @click="login">Login</button>
      <p class="switch-panel" @click="$router.push('/register')">Don't have an account? Register</p>
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
    };
  },
  methods: {
    handleLoginClick() {
      const storedUser = localStorage.getItem('authlyUser');
      if (storedUser) {
        try {
          const bytes = CryptoJS.AES.decrypt(storedUser, 'authly_secret_key');
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          if (new Date(decryptedData.expiration) > new Date()) {
            this.$router.push('/dashboard');
            return;
          }
        } catch (error) {
          console.error('Failed to decrypt user data:', error);
          localStorage.removeItem('authlyUser');
        }
      }
      // this.$router.push('login');
    },

    async login() {
      if (this.loginData.username && this.loginData.password) {
        try {
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.loginData),
          });

          const data = await response.json();

          if (response.ok && data.auth) {
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
          } else {
            alert(data.message || 'Invalid username or password');
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('An error occurred. Please try again later.');
        }
      } else {
        alert('Please enter both username and password');
      }
    },
  },
};
</script>

