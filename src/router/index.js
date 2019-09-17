import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

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
          path: '/orderList',
          name: '订单列表',
          component: resolve => require(['@/components/order/orderList'], resolve),
        },
        {
          path: '/orderDetails',
          name: '订单详情',
          component: resolve => require(['@/components/order/orderDetails'], resolve),
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
          component: resolve => require(['@/components/authority/userList'], resolve),
        },
        {
          path: '/log',
          name: '日志列表',
          component: resolve => require(['@/components/authority/log'], resolve),
        },
        {
          path: '/classify',
          name: '分类管理',
          component: resolve => require(['@/components/article/classify'], resolve),
        },
        {
          path: '/brand',
          name: '品牌管理',
          component: resolve => require(['@/components/article/brand'], resolve),
        },
        {
          path: '/addClassify',
          name: '添加分类',
          component: resolve => require(['@/components/article/addClassify'], resolve),
        },
        {
          path: '/home',
          name: '系统首页',
          component: resolve => require(['@/components/home/home'], resolve),
        }
      ]
    }
  ]
})
