import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/index'
import Users from '@/users'
import Register from '@/register'
import MyAccount from '@/myaccount'
import AdminPage from '@/admin-page'
import ShopManager from '@/shop-manager'
import MemberPage from '@/member-page'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Index
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/users/page/:page',
      name: 'Users page',
      component: Users
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/my-account',
      name: 'My Account',
      component: MyAccount
    },
    {
      path: '/admin-page',
      name: 'Admin page',
      component: AdminPage
    },
    {
      path: '/shop-manager',
      name: 'Shop manager',
      component: ShopManager
    },
    {
      path: '/member-page',
      name: 'Member page',
      component: MemberPage
    }
  ]
})
