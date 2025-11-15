import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Favorite from '../views/Favorite.vue';

const routes = [
  { path: '', name: 'Home', component: Home },
  { path: '/Favorite', name: 'Favorite', component:Favorite}
]


export default createRouter({
  history: createWebHistory(),
  routes
})
