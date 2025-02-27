import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // Asegúrate de tener este archivo

const routes = [
  { path: '/', component: Home } // Define la ruta principal
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
