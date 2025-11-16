import { createRouter, createWebHistory } from 'vue-router';
import Favorite from '../views/Favorite.vue';
import Home from '../views/Pokedex.vue';

const routes = [
  { path: '', name: 'Home', component: Home },
  { path: '/Favorite', name: 'Favorite', component:Favorite}
]


export default createRouter({
  history: createWebHistory(),
  routes
})
