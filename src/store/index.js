import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    snakeBar: {
      snackbar: false,
      y: 'top',
      x: '',
      mode: '',
      timeout: 2000,
      text: '',
      color: 'success',
      multiLine: true
    },
    login: false,
  },
  mutations: {
    SET_SNACKBAR(state, snack) {
      state.snakeBar.snackbar = snack.snackbar;
      state.snakeBar.text = snack.text;
      state.snakeBar.timeout = snack.timeout;
      state.snakeBar.y = snack.y;
      state.snakeBar.x = snack.x;
      state.snakeBar.color = snack.color;
    },
    SET_LOGIN(state, payload) {
      state.login = payload;
    }
  },
  actions: {
    showSnackbar({ commit }, payload) {
      commit('SET_SNACKBAR', payload);
    },
    setLogin({ commit }, payload){
      commit('SET_LOGIN', payload);
    }
  }
})
