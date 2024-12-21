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

<style scoped>
.panel {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  margin: 50px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.panel h2 {
  color: #42b983;
  margin-bottom: 20px;
}

.panel input {
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
}

.action-button {
  background-color: #42b983;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-button:hover {
  background-color: #2e8b57;
  transform: scale(1.05);
}

.switch-panel {
  color: #42b983;
  cursor: pointer;
  margin-top: 15px;
  font-size: 14px;
  text-decoration: underline;
}
</style>
