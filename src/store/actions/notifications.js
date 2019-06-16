import LocalStorage from "../../common/services/storage";
import { CHECK_NOTIFICATIONS, DELETE_NOTIFICATION } from "../action-types";

import { SET_NOTIFICATIONS } from "../mutation-types";

const notifications = {
  [CHECK_NOTIFICATIONS]({ getters, dispatch }) {
    getters.notifications.forEach( ( notification, index ) => {
      const performanceTime = new Date( notification.datetime ).getTime();
      const now = new Date().getTime();
      if ( performanceTime < now ) {
        dispatch( DELETE_NOTIFICATION, index );
      }
    });
  },
  [DELETE_NOTIFICATION]({ commit, getters, state }, notificationIndex ) {
    const temp = [...getters.notifications];
    temp.splice( notificationIndex, 1 );
    commit( SET_NOTIFICATIONS, temp );
    LocalStorage.saveState( state );
  }
};

export default notifications;
