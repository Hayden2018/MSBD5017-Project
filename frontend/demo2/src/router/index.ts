import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/WelcomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: 'view',
          name: 'nft-view',
          component: () => import('../views/NftView.vue')
        },
        {
          path: 'mint',
          name: 'nft-mint',
          component: () => import('../views/NftMintView.vue')
        },
        {
          path: 'transfer',
          name: 'nft-transfer',
          component: () => import('../views/NftTransferView.vue')
        }
      ]
    }
  ]
})

export default router
