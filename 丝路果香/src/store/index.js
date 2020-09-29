import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: '3-1'
  },

  mutations: {
    increment(state, name) {
      state.count = name
    }
  }
});

export default store;
