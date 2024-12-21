<template>
  <div class="home-container">
    <!-- Top Nav or Branding -->
    <header class="site-header">
      <h1>Authly</h1>
      <nav>
        <button @click="$router.push('/login')" class="nav-button">Login</button>
        <button @click="$router.push('/register')" class="nav-button">Sign Up</button>
      </nav>
    </header>

    <!-- Hero Section -->
    <main>
      <div class="hero-content">
        <h2>
          Welcome to <span class="typed-text"></span>
        </h2>
        <p>Secure your digital space with our next-gen authentication solution.</p>
        <button class="cta-button" @click="$router.push('/login')">Get Started</button>
      </div>
    </main>

    <!-- Example About/Why Section -->
    <section class="scroll-section reveal about-section">
      <h3>Why Authly?</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed orci nec sem
        aliquet iaculis. Suspendisse vitae vulputate diam.
      </p>
    </section>


    <section class="scroll-section reveal features-section">
      <h3>Features</h3>
      <div class="features-grid">
        <div class="feature-card">
          <div class="icon">🔒</div>
          <h4>Secure Protocols</h4>
          <p>We implement the latest encryption standards to keep your data safe.</p>
        </div>
        <div class="feature-card">
          <div class="icon">⚡</div>
          <h4>Fast Integration</h4>
          <p>Plug in our authentication to your project with minimal setup.</p>
        </div>
        <div class="feature-card">
          <div class="icon">📈</div>
          <h4>Real-time Analytics</h4>
          <p>Track usage, monitor key metrics, and scale with confidence.</p>
        </div>
        <div class="feature-card">
          <div class="icon">☁️</div>
          <h4>Cloud Ready</h4>
          <p>Deployed on reliable cloud infrastructure with 99.9% uptime.</p>
        </div>

        <div class="feature-card">
          <div class="icon">🔐</div>
          <h4>Multi-Factor Auth</h4>
          <p>Enhance security with multiple layers of authentication.</p>
        </div>

        <div class="feature-card">
          <div class="icon">🔧</div>
          <h4>Easy Customization</h4>
          <p>Tailor authentication flows to match your brand and user experience.</p>
        </div>
      </div>
    </section>

    <!-- Wave background at the very bottom -->
    <div class="wave-container">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s
               58 18 88 18 58-18 88-18 
               58 18 88 18v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.2)" />
          <use href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.15)" />
          <use href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.1)" />
          <use href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>

    <!-- Footer -->
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
  name: 'HomePage',
  mounted() {
    this.initTypedText();
    this.initScrollReveal();
  },
  methods: {
    initTypedText() {
      const typedTextEl = document.querySelector('.typed-text');
      const texts = ['Authly ', 'Next-Gen Auth ', 'Your Secure Auth ', 'Your Secure Service'];
      let index = 0;
      let charIndex = 0;
      let currentText = '';
      let isDeleting = false;

      const type = () => {
        if (isDeleting) {
          currentText = texts[index].substring(0, charIndex--);
        } else {
          currentText = texts[index].substring(0, charIndex++);
        }

        typedTextEl.textContent = currentText;

        if (!isDeleting && charIndex === texts[index].length) {
          isDeleting = true;
          setTimeout(type, 1500);
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          index = (index + 1) % texts.length;
          setTimeout(type, 300);
        } else {
          setTimeout(type, isDeleting ? 80 : 130);
        }
      };

      type();
    },

    initScrollReveal() {
      const revealElements = document.querySelectorAll('.reveal');
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      };

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, options);

      revealElements.forEach(el => {
        observer.observe(el);
      });
    },
  },
};
</script>
