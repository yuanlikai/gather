import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      name: '*',
      component: resolve => require(['@/components/index'], resolve)
    },
    {
      path: '/',
      name: 'index',
      component: resolve => require(['@/components/index'], resolve)
    },
    {
      path: '/Layout',
      name: 'Layout',
      component: resolve => require(['@/components/Layout'], resolve),
      children: [
        {
          path: '/table',
          name: 'table',
          component: resolve => require(['@/components/product/table'], resolve),
        },
        {
          path: '/details',
          name: 'details',
          component: resolve => require(['@/components/product/details'], resolve),
        },
        {
          path: '/menuList',
          name: '菜单列表',
          component: resolve => require(['@/components/authority/menuList'], resolve),
        },
        {
          path: '/roleList',
          name: '角色列表',
          component: resolve => require(['@/components/authority/roleList'], resolve),
        },
        {
          path: '/userList',
          name: '用户列表',
          params: {userId: '123'},
          component: resolve => require(['@/components/authority/userList'], resolve),
        },
      ]
    }
  ]
})
