import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {

            path: '/',
            name: 'Login',
            title: 'Log in',
            component: () => import('../components/logInPage.vue')
        },
        {
            path: '/reg',
            name: 'reg',
            title: 'Register',
            component: () => import('../components/registerPage.vue')
        },
        {
            path: '/home',
            name: 'home',
            title: 'Home',
            component: () => import('../components/homePage.vue')
        }

    ]
});



router.beforeEach((to, from, next) => {
    next()
})



export default router;
