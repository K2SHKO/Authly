<template>
  <div id="app">
    <nav>
      Authly
    </nav>
    <main v-if="!isLoggedIn">
      <div class="welcome-message">
        <h1>WELCOME TO <span class="typed-text"></span></h1>
      </div>
      <button class="center-button" @click="showLogin = true">Login</button>
      <div v-if="showLogin" class="panel">
        <h2>Login</h2>
        <input type="text" v-model="loginData.username" placeholder="Username">
        <input type="password" v-model="loginData.password" placeholder="Password">
        <button class="action-button" @click="login">Login</button>
        <p class="switch-panel" @click="showRegister = true; showLogin = false">Don't have an account? Register</p>
      </div>
      <div v-if="showRegister" class="panel">
        <h2>Register</h2>
        <input type="text" v-model="registerData.username" placeholder="Username">
        <input type="password" v-model="registerData.password" placeholder="Password">
        <input type="email" v-model="registerData.email" placeholder="Email">
        <button class="action-button" @click="register">Register</button>
        <p class="switch-panel" @click="showLogin = true; showRegister = false">Already have an account? Login</p>
      </div>
    </main>
    <main v-else>
      <div class="user-panel">
        <h1>Welcome, {{ loggedInUsername }}</h1>
        <button class="center-button" @click="logout">Logout</button>
      </div>
    </main>
    <footer>
      <p>&copy; 2023 Authly. All rights reserved.</p>
      <p class="powered-by">Powered by Vue.js</p>
    </footer>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'App',
  data() {
    return {
      showLogin: false,
      showRegister: false,
      isLoggedIn: false,
      loginData: {
        username: '',
        password: '',
      },
      registerData: {
        username: '',
        password: '',
        email: '',
      },
      loggedInUsername: '',
      encryptionKey: 'my_secret_key_12345', // Klucz do szyfrowania
    };
  },
  mounted() {
    document.title = "Authly - Your Secure Auth";
    this.initTypedText();
    this.checkLoginStatus(); // Sprawdź, czy użytkownik jest już zalogowany
  },
  methods: {
    initTypedText() {
      const typedText = document.querySelector('.typed-text');
      const texts = ["AUTHLY", "Your Auth", "Secure Login"];
      let index = 0;
      let charIndex = 0;
      let currentText = '';
      let isDeleting = false;

      function type() {
        if (isDeleting) {
          currentText = texts[index].substring(0, charIndex--);
        } else {
          currentText = texts[index].substring(0, charIndex++);
        }

        typedText.textContent = currentText;

        if (!isDeleting && charIndex === texts[index].length) {
          isDeleting = true;
          setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          index = (index + 1) % texts.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, isDeleting ? 100 : 200);
        }
      }

      type();
    },
    encryptData(data) {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    },
    decryptData(encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },
    checkLoginStatus() {
      const storedUser = localStorage.getItem('authlyUser');
      if (storedUser) {
        try {
          const decryptedUser = this.decryptData(storedUser);
          const expirationDate = new Date(decryptedUser.expiration);
          if (new Date() < expirationDate) {
            this.isLoggedIn = true;
            this.loggedInUsername = decryptedUser.username;
          } else {
            localStorage.removeItem('authlyUser'); // Usuń przestarzałe dane
          }
        } catch (error) {
          console.error('Błąd odszyfrowywania danych logowania:', error);
          localStorage.removeItem('authlyUser'); // Usuń uszkodzone dane
        }
      }
    },
    async login() {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginData),
        });
        const data = await response.json();
        if (data.auth) {
          alert('Login successful');
          this.isLoggedIn = true;
          this.loggedInUsername = this.loginData.username;

          // Zapisz użytkownika w LocalStorage z datą ważności
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7); // 7 dni
          const encryptedData = this.encryptData({
            username: this.loginData.username,
            expiration: expirationDate,
          });
          localStorage.setItem('authlyUser', encryptedData);
        } else {
          alert('Login failed: ' + data.message);
        }
      } catch (error) {
        alert('Login error: ' + error.message);
      }
    },
    async register() {
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.registerData),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Registration successful');
          this.showRegister = false;
          this.showLogin = true;
        } else {
          alert('Registration failed: ' + data.error);
        }
      } catch (error) {
        alert('Registration error: ' + error.message);
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.loggedInUsername = '';
      localStorage.removeItem('authlyUser');
      alert('Logged out successfully');
    },
  },
};
</script>

<style src="./assets/style.css"></style>
<style src="./assets/panel.css"></style>
