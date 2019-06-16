import Raven from "raven-js";
import HelperService from "../../common/services/helper";
import NotificationService from "../../common/services/notification";
import LocalStorage from "../../common/services/storage";
import Api from "../../common/services/api";
import { TOKEN_EXPIRED, USER_IDLE } from "../../common/error-types";
import { CYCLE_1, CYCLE_2, CYCLE_3, CYCLE_4 } from "../../common/constants";
import {
  LAUNCH_APP,
  ADD_NOTIFICATION,
  CHECK_REMINDERS,
  CHECK_NOTIFICATIONS,
  CONFIGURE_CYCLE,
  RUN_CYCLE,
  ADD_DANGER_BADGE,
  REMOVE_BADGE
} from "../action-types";
import {
  SET_TOKENS,
  SET_IS_APP_RUNNING,
  SET_TIMER,
  SET_CURRENT_MUSIC,
  SET_CURRENT_NOTIFICATION,
  SET_CYCLE
} from "../mutation-types";

const engine = {
  [LAUNCH_APP]({ commit, state, getters, dispatch }) {
    const runApp = async () => {
      dispatch( CHECK_REMINDERS );
      dispatch( CHECK_NOTIFICATIONS );

      if ( getters.readyToRun ) {
        commit( SET_IS_APP_RUNNING, true );
        dispatch( REMOVE_BADGE );
        try {
          const { data: newMusic } = await Api.compareSongs(
            getters.accessToken,
            getters.currentMusic.songId
          );

          if ( newMusic.recheck ) {
            // A song was skipped - reset the timer to the starting cycle time
            commit( SET_CYCLE, CYCLE_1 );

            const { data: performances } = await Api.checkPerformances(
              newMusic.artist,
              getters.latitude,
              getters.longitude,
              getters.travelDistance
            );

            if ( performances.matched && performances.matched.length ) {
              // Theere are performances matching the user specification
              const closestPerformance = HelperService.retrieveClosestPerformance(
                performances.matched
              );

              const isCached = HelperService.isNotificationCached(
                getters.notifications,
                closestPerformance
              );
              /**
               * TODO: cache a performance only if it's been dislpayed as a notification already
               * So that users who all of a sudden change their distance preference would get a notif
               */

              if ( !isCached ) {
                const notification = NotificationService.createNotificationObject(
                  closestPerformance,
                  newMusic
                );
                NotificationService.createNotificationPopup(
                  notification.popupObj
                );
                dispatch( ADD_NOTIFICATION, notification );
                commit( SET_CURRENT_NOTIFICATION, notification );
                Raven.captureMessage( "Notification shown" );
                LocalStorage.saveState( state );
              }
            }
          } else {
            dispatch( CONFIGURE_CYCLE, newMusic );
          }

          // TODO: This overwrites the artist in notification
          // if the song changes
          commit( SET_CURRENT_MUSIC, newMusic );
          LocalStorage.saveState( state );

          // Re-run the algorithm with the new timer
          dispatch( RUN_CYCLE, runApp );
        } catch ( error ) {
          /**
           * TODO: Implement a workflow if the current cluster receives too many requests
           * and errors with a status 429 https://github.com/thelinmichael/spotify-web-api-node/issues/149
           * (handle on backend)
           * */
          /**
           * TODO: If check performances fails then it doesn't set current music
           */
          // set the app to restart after 10s on any error
          commit( SET_CYCLE, CYCLE_1 );
          if ( error.message === TOKEN_EXPIRED ) {
            Api.refreshAccessToken( getters.refreshToken, getters.cluster ).then(
              ({ data }) => {
                const tokens = {
                  accessToken: data.accessToken,
                  refreshToken: getters.refreshToken
                };
                commit( SET_TOKENS, tokens );
                LocalStorage.saveState( state );
              }
            );
          } else if ( error.message === USER_IDLE ) {
            commit( SET_CYCLE, CYCLE_4 );
          }
          // Restart app
          dispatch( RUN_CYCLE, runApp );
        }
      } else {
        // set badge
        dispatch( ADD_DANGER_BADGE );
        /**
         * TODO: add a message and restart button in case of a problem
         */
      }
    };
    // Initial run
    dispatch( RUN_CYCLE, runApp );
  },
  [CONFIGURE_CYCLE](
    { commit, getters },
    { progress_ms: currentProgress, duration_ms: currentDuration }
  ) {
    /* ----------  Alternate timer cycles  ----------*/
    let cycle;
    if ( currentProgress === getters.currentMusic.progress_ms ) {
      // The user has stopped listening or paused the song
      if ( getters.cycle < CYCLE_2 ) {
        /**
         * give 30s if the user  paused the song temporarily
         */
        cycle = CYCLE_2;
      } else {
        /**
         * The user has stopped listening
         */
        cycle = CYCLE_4;
      }
    } else if ( currentProgress < CYCLE_1 ) {
      // check if there was a skip after 10s
      cycle = CYCLE_1 - currentProgress;
    } else if ( currentProgress < CYCLE_2 ) {
      // check if there was a skip after 30s
      cycle = CYCLE_2 - currentProgress;
    } else {
      //   check after 15s or after the song has finished + 2s
      cycle = CYCLE_3;
      const remainder = currentDuration - currentProgress + 2000;
      if ( remainder < CYCLE_3 ) {
        cycle = remainder;
      }
    }
    commit( SET_CYCLE, cycle );
  },
  [RUN_CYCLE]({ commit, getters }, appFunction ) {
    const timer = setTimeout( appFunction, getters.cycle );
    commit( SET_TIMER, timer );
  }
};

export default engine;
