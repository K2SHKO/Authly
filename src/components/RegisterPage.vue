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
    };
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    async register() {
      if (this.registerData.username && this.registerData.password && this.registerData.email) {
        try {
          const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.registerData),
          });

          const data = await response.json();

          if (response.ok) {
            alert(data.message);
            this.$router.push('/login');
          } else {
            alert(data.message || 'Registration failed');
          }
        } catch (error) {
          console.error('Registration error:', error);
          alert('An error occurred. Please try again later.');
        }
      } else {
        alert('Please fill out all fields');
      }
    },
  },
};
</script>
