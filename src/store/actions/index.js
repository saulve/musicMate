import { browser } from "webextension-polyfill-ts";
import LocalStorage from "../../common/services/storage";
import router from "../../popup/router";
import Api from "../../common/services/api";
import messages from "./messages";
import events from "./events";
import reminder from "./reminder";
import notifications from "./notifications";
import engine from "./engine";

import { CLIENT_ID, API_URL, SCOPES } from "../../common/constants";

import {
  LOGIN_TO_SPOTIFY,
  FETCH_TOKENS_AND_USER,
  UPDATE_USER,
  STOP_APP,
  FETCH_LOCATION,
  UPDATE_LOCATION,
  UPDATE_DISTANCE,
  REVIVE_STATE,
  ADD_NOTIFICATION,
  ADD_DANGER_BADGE,
  REMOVE_BADGE
} from "../action-types";
import {
  SET_TOKENS,
  SET_USER,
  SET_IS_APP_RUNNING,
  SET_TIMER,
  SET_LOCATION,
  SET_DISTANCE,
  SET_LOGGED_IN,
  SET_CURRENT_MUSIC,
  SET_NOTIFICATIONS,
  SET_CURRENT_NOTIFICATION,
  SET_REMINDERS,
  SET_CYCLE,
  SET_CLUSTER
} from "../mutation-types";

const actions = {
  ...messages,
  ...reminder,
  ...notifications,
  ...events,
  ...engine,
  [LOGIN_TO_SPOTIFY]({ dispatch }) {
    function test( response ) {
      const regex = /\/callback/g;
      // create a new uri with get the query bit from the response
      const uri = `${API_URL}${response.slice( response.search( regex ) )}`;
      dispatch( FETCH_TOKENS_AND_USER, uri );
    }
    const redirectUri = `${browser.identity.getRedirectURL()}callback`;
    const authURL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent( SCOPES.join( " " ) )}&show_dialog=true,`;

    return browser.identity.launchWebAuthFlow(
      {
        interactive: true,
        url: authURL
      },
      test
    );
  },
  [FETCH_TOKENS_AND_USER]({ commit, state }, params ) {
    Api.fetchTokensAndUser( params ).then( ({ data }) => {
      const tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
      commit( SET_TOKENS, tokens );
      commit( SET_USER, data.user );
      commit( SET_LOGGED_IN, true );
      commit( SET_CLUSTER, data.cluster );
      LocalStorage.saveState( state );
      router.push( "/main" );
    });
  },
  [UPDATE_USER]({ commit, state }, user ) {
    commit( SET_USER, user );
    LocalStorage.saveState( state );
  },
  [ADD_NOTIFICATION]({ commit, getters, state }, notification ) {
    const temp = [...getters.notifications];
    temp.push( notification );
    commit( SET_NOTIFICATIONS, temp );
    LocalStorage.saveState( state );
  },
  [STOP_APP]({ commit, getters }) {
    clearInterval( getters.timer );
    commit( SET_TIMER, null );
    commit( SET_IS_APP_RUNNING, false );
  },
  [FETCH_LOCATION]({ commit }, params ) {
    return Api.getCoordinates( params );
  },
  [UPDATE_LOCATION]({ commit, state }, params ) {
    const location = {
      latitude: params.geocodePoints[0].coordinates[0],
      longitude: params.geocodePoints[0].coordinates[1],
      currentLocation: params.address.formattedAddress
    };
    commit( SET_LOCATION, location );
    LocalStorage.saveState( state );
  },
  [UPDATE_DISTANCE]({ commit, state }, params ) {
    commit( SET_DISTANCE, params );
    LocalStorage.saveState( state );
  },
  [ADD_DANGER_BADGE]() {
    browser.browserAction.setBadgeBackgroundColor({ color: "#DC3545" });
    browser.browserAction.setBadgeText({ text: "❕" });
  },
  [REMOVE_BADGE]() {
    browser.browserAction.setBadgeText({ text: "" });
  },
  [REVIVE_STATE]({ commit }, params ) {
    return new Promise( resolve => {
      commit( SET_LOCATION, params );
      commit( SET_DISTANCE, params.travelDistance );
      commit( SET_TIMER, params.timer );
      commit( SET_TOKENS, params );
      commit( SET_USER, params.user );
      commit( SET_LOGGED_IN, params.isLoggedIn );
      commit( SET_IS_APP_RUNNING, params.running );
      commit( SET_CURRENT_NOTIFICATION, params.currentNotification );
      commit( SET_CURRENT_MUSIC, params.currentMusic );
      commit( SET_CYCLE, params.cycle );
      commit( SET_CLUSTER, params.cluster );
      commit( SET_REMINDERS, params.reminders );
      commit( SET_NOTIFICATIONS, params.notifications );
      resolve();
      // commit( SET_NOTIFICATIONS, [] );
      // commit( SET_REMINDERS, [] );
    });
  }
};

export default actions;
