<template>
    <main>
      <div class="welcome-message">
        <h1>WELCOME TO <span class="typed-text"></span></h1>
      </div>
      <button class="center-button" @click="$router.push('/login')">Login</button>
    </main>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
    mounted() {
      this.initTypedText();
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
    },
  };
  </script>