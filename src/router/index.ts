import { createRouter, createWebHistory } from 'vue-router'
import { useUUIDStore } from '@/stores/userInfo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mario/:uuid',
      name: 'adminHome',
      component: () => import('@/views/admin/AdminHome.vue')
    },
    {
      path: '/mario/users',
      name: 'userMangement',
      meta: { requireAuth: true },
      component: () => import('@/views/admin/UserManage.vue')
    },
    {
      path: '/mario/tasks',
      name: 'tasks',
      meta: { requireAuth: true },
      component: () => import('@/views/admin/TaskList.vue')
    },
    {
      path: '/mario/taskRets',
      name: 'taskRets',
      meta: { requireAuth: true },
      component: () => import('@/views/admin/TaskRet.vue')
    },
    {
      path: '/user/:uuid',
      name: 'userPage',
      component: () => import('@/views/user/UserHome.vue')
    },
    {
      path: '/user-seats',
      name: 'userSeats',
      meta: { requireAuth: true },
      component: () => import('@/views/user/UserSeats.vue')
    },
    {
      path: '/user-task',
      name: 'userTask',
      meta: { requireAuth: true },
      component: () => import('@/views/user/UserTask.vue')
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/user/HelpPage.vue')
    },

    {
      path: '/:xxx(.*)*',
      name: 'errorPage',
      component: () => import('@/views/error/ErrorPage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const store = useUUIDStore()
    const uuid = store.getUUID
    if (uuid !== '' && uuid !== undefined) {
      next()
    } else {
      next({ name: 'ErrorPage', query: { redirect: to.fullPath } })
    }
  } else next()
})

export default router
