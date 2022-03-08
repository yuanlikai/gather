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
          path: '/home',
          name: '系统首页',
          component: resolve => require(['@/components/home/home'], resolve),
        },
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
          name: '客服模式',
          component: resolve => require(['@/components/order/orderList'], resolve),
        },
        {
          path: '/CG-order',
          name: '采购模式',
          component: resolve => require(['@/components/order/CG-order'], resolve),
        },
        {
          path: '/GYS-order',
          name: '供应商模式',
          component: resolve => require(['@/components/order/GYS-order'], resolve),
        },
        {
          path: '/orderPurchase',
          name: '订单列表(采购)',
          component: resolve => require(['@/components/order/orderPurchase'], resolve),
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
          path: '/addBrand',
          name: '添加品牌',
          component: resolve => require(['@/components/article/addBrand'], resolve),
        },
        {
          path: '/inquireList',
          name: '商品查询',
          component: resolve => require(['@/components/article/inquireList'], resolve),
        },
        {
          path: '/recycleList',
          name: '回收站',
          component: resolve => require(['@/components/article/recycleList'], resolve),
        },
        {
          path: '/auditList',
          name: '商品审核',
          component: resolve => require(['@/components/article/auditList'], resolve),
        },
        {
          path: '/putaway',
          name: '商品上架',
          component: resolve => require(['@/components/article/putaway'], resolve),
        },
        {
          path: '/productList',
          name: '商品列表',
          component: resolve => require(['@/components/article/productList'], resolve),
        },
        {
          path: '/productLog',
          name: '商品日志',
          component: resolve => require(['@/components/article/productLog'], resolve),
        },
        {
          path: '/addArticle',
          name: '添加商品',
          component: resolve => require(['@/components/article/addArticle'], resolve),
        },
        {
          path: '/examine',
          name: '商品详情',
          component: resolve => require(['@/components/article/examine'], resolve),
        },
        {
          path: '/addClassify',
          name: '添加分类',
          component: resolve => require(['@/components/article/addClassify'], resolve),
        },
        {
          path: '/terrace',
          name: '平台设置',
          component: resolve => require(['@/components/setting/terrace'], resolve),
        },
        {
          path: '/supplier',
          name: '供应商设置',
          component: resolve => require(['@/components/setting/supplier'], resolve),
        },
        {
          path: '/supplierUser',
          name: '供应商用户',
          component: resolve => require(['@/components/setting/supplierUser'], resolve),
        },
        {
          path: '/relevance',
          name: '关联设置',
          component: resolve => require(['@/components/setting/relevance'], resolve),
        },
        {
          path: '/addSupplier',
          name: '新建供应商',
          component: resolve => require(['@/components/setting/addSupplier'], resolve),
        },
        {
          path: '/terraceClassify',
          name: '分类映射',
          component: resolve => require(['@/components/setting/terraceClassify'], resolve),
        },
        {
          path: '/addTerrace',
          name: '添加平台',
          component: resolve => require(['@/components/setting/addTerrace'], resolve),
        },
        {
          path: '/commerce',
          name: '电商平台导单',
          component: resolve => require(['@/components/lead/commerce'], resolve),
        },
        {
          path: '/pick',
          name: '提货平台导单',
          component: resolve => require(['@/components/lead/pick'], resolve),
        },
        {
          path: '/createOrder',
          name: '下单',
          component: resolve => require(['@/components/createOrder/createOrder'], resolve),
        }
      ]
    }
  ]
})
