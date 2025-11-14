import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Favorite from '../views/Favorite.vue';
import Details from '../views/Details.vue';

const routes = [
  { path: '', name: 'Home', component: Home },
  { path: '/Favorite', name: 'Favorite', component:Favorite},
  { path: '/Details', name: 'Details', component:Details}
]


export default createRouter({
  history: createWebHistory(),
  routes
})
