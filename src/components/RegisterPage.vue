<template>
  <div class="home-container">
    <header class="site-header">
      <h1 class="home-link" @click="$router.push('/')">Authly</h1>
      <nav>
        <button @click="goToLogin" class="nav-button">Login</button>
        <button @click="$router.push('/register')" class="nav-button">Sign Up</button>
      </nav>
    </header>

    <main>
      <div class="panel">
        <h2>Register</h2>
        <input type="text" v-model="registerData.username" placeholder="Username" />
        <input type="password" v-model="registerData.password" placeholder="Password" />
        <input type="email" v-model="registerData.email" placeholder="Email" />
        <button class="action-button" @click="register">Register</button>
        <p class="switch-panel" @click="$router.push('/login')">Already have an account? Login</p>
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
export default {
  name: 'RegisterPage',
  data() {
    return {
      registerData: {
        username: '',
        password: '',
        email: '',
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
        alert(response.message);
        this.$router.push('/login');
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
    goToLogin() {
      this.$router.push('/login');
    },
    register() {
      if (this.registerData.username && this.registerData.password && this.registerData.email) {
        const payload = {
          type: 'register',
          payload: this.registerData,
        };
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(payload));
        } else {
          alert('WebSocket connection is not established');
        }
      } else {
        alert('Please fill out all fields');
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
