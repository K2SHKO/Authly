<template>
    <div class="settings-tab">
      <h2>Settings</h2>
      <div class="settings-section">
        <label>Change Password:</label>
        <input type="password" v-model="password" placeholder="Enter new password" />
        <button class="btn-primary" @click="changePassword">Update Password</button>
      </div>
      <div class="settings-section">
        <label>Delete Account:</label>
        <button class="btn-danger" @click="deleteAccount">Delete</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        password: '',
      };
    },
    methods: {
      async changePassword() {
        if (!this.password) {
          alert('Please enter a password.');
          return;
        }
        await fetch('http://localhost:3000/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.$root.loggedInUsername, password: this.password }),
        });
        alert('Password updated successfully');
      },
      async deleteAccount() {
        const confirmation = confirm('Are you sure you want to delete your account?');
        if (!confirmation) return;
  
        await fetch(`http://localhost:3000/delete-account`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.$root.loggedInUsername }),
        });
        alert('Account deleted successfully');
        this.$router.push('/register');
      },
    },
  };
  </script>
  
  <style>
 
  .settings-section {
    margin-bottom: 20px;
  }
  </style>
  