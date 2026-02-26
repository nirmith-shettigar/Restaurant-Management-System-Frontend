const state = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const getters = {
  currentUser: (state) => state.user,
  isAuthenticated: (state) => state.isAuthenticated,
  userRole: (state) => state.user?.role || null,
  userId: (state) => state.user?.id || null,
  token: (state) => state.token,
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    state.isAuthenticated = !!user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  CLEAR_AUTH(state) {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
  },
  INITIALIZE_AUTH(state) {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      try {
        state.user = JSON.parse(user);
        state.token = token;
        state.isAuthenticated = true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    }
  },
};

const actions = {
  login({ commit }, { user, token }) {
    commit('SET_USER', user);
    commit('SET_TOKEN', token);
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },
  
  logout({ commit }) {
    commit('CLEAR_AUTH');
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
  
  initializeAuth({ commit }) {
    commit('INITIALIZE_AUTH');
  },
  
  updateUser({ commit, state }, userData) {
    const updatedUser = { ...state.user, ...userData };
    commit('SET_USER', updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
