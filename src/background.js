import { browser } from "webextension-polyfill-ts";
import Vue from "vue";
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";
import store from "./store";
import LocalStorage from "./common/services/storage";
import { SENTRY_DSN } from "./common/constants";
import {
  LAUNCH_APP,
  STOP_APP,
  REVIVE_STATE,
  CREATE_REMINDER,
  EVT_STOP_APP,
  EVT_START_APP
} from "./store/action-types";

const init = () => {
  if ( process.env.NODE_ENV === "production" ) {
    Raven.config( SENTRY_DSN )
      .addPlugin( RavenVue, Vue )
      .install();
  }

  LocalStorage.getSavedState().then( ({ mmState }) => {
    const state = mmState || store.state;
    store.dispatch( REVIVE_STATE, state ).then( () => {
      store.dispatch( LAUNCH_APP );
    });
  });
};

browser.runtime.onMessage.addListener( message => {
  if ( message === EVT_STOP_APP ) {
    store.dispatch( STOP_APP );
  }
  if ( message === EVT_START_APP ) {
    store.dispatch( LAUNCH_APP );
  }
});

browser.notifications.onButtonClicked.addListener(
  ( notificationId, buttonId ) => {
    if ( buttonId === 0 ) {
      store.dispatch( CREATE_REMINDER );
    } else if ( buttonId === 1 ) {
      /**
       * Open a new tab to buy performance tickets when the notification
       * is clicked
       */
      Raven.captureMessage( "Tickets shown" );
      window.open( store.getters.currentNotification.ticketUrl, "_blank" );
    }
  }
);

init();
