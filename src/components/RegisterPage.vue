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
      async register() {
        if (this.registerData.username && this.registerData.password && this.registerData.email) {
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
              alert(data.message || 'Registration successful');
              this.$router.push('/login');
            } else {
              alert(data.error || 'An error occurred during registration');
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
  