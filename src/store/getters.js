const getters = {
  accessToken( state ) {
    return state.accessToken;
  },
  refreshToken( state ) {
    return state.refreshToken;
  },
  isLoggedIn( state ) {
    return state.isLoggedIn;
  },
  user( state ) {
    return state.user;
  },
  timer( state ) {
    return state.timer;
  },
  latitude( state ) {
    return state.latitude;
  },
  longitude( state ) {
    return state.longitude;
  },
  travelDistance( state ) {
    return state.travelDistance;
  },
  currentLocation( state ) {
    return state.currentLocation;
  },
  error( state ) {
    return state.error;
  },
  currentMusic( state ) {
    return state.currentMusic;
  },
  running( state ) {
    return state.running;
  },
  currentNotification( state ) {
    return state.currentNotification;
  },
  notifications( state ) {
    return state.notifications;
  },
  reminders( state ) {
    return state.reminders;
  },
  message( state ) {
    return state.message;
  },
  cycle( state ) {
    return state.cycle;
  },
  cluster( state ) {
    return state.cluster;
  },
  readyToRun( state ) {
    if (
      state.accessToken &&
      state.isLoggedIn &&
      state.latitude &&
      state.longitude &&
      state.travelDistance
    ) {
      return true;
    }
    return false;
  }
};

export default getters;
