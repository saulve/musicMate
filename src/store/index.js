import Vue from "vue";
import Vuex from "vuex";
import VuexWebExtensions from "vuex-webextensions";
import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

Vue.use( Vuex );

export default new Vuex.Store({
  state: {
    accessToken: null,
    refreshToken: null,
    isLoggedIn: false,
    user: null,
    timer: null,
    latitude: null,
    longitude: null,
    travelDistance: 50,
    currentLocation: null,
    error: false,
    currentMusic: { songId: "id" },
    running: false,
    notifications: [],
    reminders: [],
    currentNotification: null,
    message: null,
    cycle: 100, // run app after 100ms innitially
    cluster: null
  },
  actions,
  getters,
  mutations,
  plugins: [VuexWebExtensions()]
});
