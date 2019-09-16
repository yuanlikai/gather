// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'//兼容

import yl from 'ylcookie'

Vue.prototype.Yl = yl;

import qs from 'qs'

Vue.prototype.Qs = qs;

import axios from 'axios'

Vue.prototype.Axios = axios;

import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(iView);



// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  //无权限，重定向到登录页面
  if (error.response.status === 401) {
    router.push('/');
    vm.$Message.warning('登录信息已过期，请重新登录！')
  }else if(error.response.status === 403) {
    vm.$Message.warning('你的权限不足')
  }
  return Promise.reject(error);
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
