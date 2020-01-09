import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Estados from '../views/Estados'

import Cidades from '../views/Cidades'
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/estados',
    component: Estados,
    name: 'estados.index',
  },
  {
    path: '/cidades',
    component: Cidades,
    name: 'cidades.index',
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
