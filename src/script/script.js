export default {
    name: 'App',
    mounted() {
      document.title = "My Awesome Vue.js App";
      this.initTypedText();
    },
    methods: {
      initTypedText() {
        const typedText = document.querySelector('.typed-text');
        const texts = ["AUTHLY ", "YOUR AUTH ", "SESCURE HOST "];
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
      }
    }
  }