import LocalStorage from "../../common/services/storage";
import HelperService from "../../common/services/helper";
import NotificationService from "../../common/services/notification";
import { DEFAULT_REMINDER_TIME } from "../../common/constants";
import {
  CREATE_REMINDER,
  ADD_REMINDER,
  CHECK_REMINDERS,
  REMOVE_REMINDER
} from "../action-types";

import { SET_CURRENT_NOTIFICATION, SET_REMINDERS } from "../mutation-types";

const reminder = {
  [ADD_REMINDER]({ commit, getters, state }, newReminder ) {
    const temp = [...getters.reminders];
    temp.push( newReminder );
    commit( SET_REMINDERS, temp );
    LocalStorage.saveState( state );
  },
  [REMOVE_REMINDER]({ commit, getters, state }, reminderIndex ) {
    const temp = [...getters.reminders];
    temp.splice( reminderIndex, 1 );
    commit( SET_REMINDERS, temp );
    LocalStorage.saveState( state );
  },
  [CREATE_REMINDER]({ getters, dispatch }) {
    const delayedTime = new Date().getTime() + DEFAULT_REMINDER_TIME;
    const reminderObj = NotificationService.createReminderObject(
      getters.currentMusic.artist,
      getters.currentNotification,
      delayedTime
    );
    dispatch( ADD_REMINDER, reminderObj );

    // Show reminder confirmation popup
    NotificationService.createNotificationPopup( reminderObj.popup );
  },
  [CHECK_REMINDERS]({ commit, getters, dispatch, state }) {
    const reminderIndex = HelperService.isReminderDue( getters.reminders );

    if ( reminderIndex > -1 ) {
      const { notification } = getters.reminders[reminderIndex];
      NotificationService.createNotificationPopup( notification.popupObj );
      commit( SET_CURRENT_NOTIFICATION, notification );
      dispatch( REMOVE_REMINDER, reminderIndex );
      LocalStorage.saveState( state );
    }
  }
};

export default reminder;
