import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/:uuid',
      name: 'userPage',
      component: () => import('@/views/user/UserHome.vue')
    },
    {
      path: '/user-seats',
      name: 'userSeats',
      component: () => import('@/views/user/UserSeats.vue')
    },
    {
      path: '/user-task',
      name: 'userTask',
      component: () => import('@/views/user/UserTask.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/components/tyingTools.vue')
    },
    {
      path: '/mario/:uuid',
      name: 'marioAdmin',
      component: () => import('@/views/AdminHome.vue')
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/user/HelpPage.vue')
    },

    {
      path: '/:xxx(.*)*',
      name: 'errorPage',
      component: () => import('@/views/ErrorPage.vue')
    }
  ]
})

export default router
