import {
  SET_TOKENS,
  SET_USER,
  SET_TIMER,
  SET_IS_APP_RUNNING,
  SET_LOCATION,
  SET_DISTANCE,
  SET_LOGGED_IN,
  SET_CURRENT_MUSIC,
  SET_NOTIFICATIONS,
  SET_CURRENT_NOTIFICATION,
  SET_REMINDERS,
  SET_MESSAGE,
  SET_CYCLE,
  SET_CLUSTER
} from "./mutation-types";

const mutations = {
  [SET_TOKENS]( state, tokens ) {
    state.accessToken = tokens.accessToken;
    state.refreshToken = tokens.refreshToken;
  },
  [SET_USER]( state, user ) {
    state.user = user;
  },
  [SET_TIMER]( state, timer ) {
    state.timer = timer;
  },
  [SET_IS_APP_RUNNING]( state, running ) {
    state.running = running;
  },
  [SET_LOCATION]( state, location ) {
    state.latitude = location.latitude;
    state.longitude = location.longitude;
    state.currentLocation = location.currentLocation;
  },
  [SET_DISTANCE]( state, distance ) {
    state.travelDistance = distance;
  },
  [SET_LOGGED_IN]( state, isLoggedIn ) {
    state.isLoggedIn = isLoggedIn;
  },
  [SET_CURRENT_MUSIC]( state, currentMusic ) {
    state.currentMusic = currentMusic;
  },
  [SET_NOTIFICATIONS]( state, notifications ) {
    state.notifications = notifications;
  },
  [SET_CURRENT_NOTIFICATION]( state, currentNotification ) {
    state.currentNotification = currentNotification;
  },
  [SET_REMINDERS]( state, reminders ) {
    state.reminders = reminders;
  },
  [SET_MESSAGE]( state, message ) {
    state.message = message;
  },
  [SET_CYCLE]( state, cycle ) {
    state.cycle = cycle;
  },
  [SET_CLUSTER]( state, cluster ) {
    state.cluster = cluster;
  }
};

export default mutations;
