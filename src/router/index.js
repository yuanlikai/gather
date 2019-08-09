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
      children:[
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
          name: 'menuList',
          component: resolve => require(['@/components/authority/menuList'], resolve),
        },
      ]
    }
  ]
})
