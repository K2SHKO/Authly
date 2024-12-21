import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import RegisterPage from './components/RegisterPage.vue';
import DashboardPage from './components/DashboardPage.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/dashboard', component: DashboardPage },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
