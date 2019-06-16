import { browser } from "webextension-polyfill-ts";
import { EVT_STOP_APP, EVT_START_APP } from "../action-types";

const events = {
  [EVT_STOP_APP]() {
    browser.runtime.sendMessage( EVT_STOP_APP );
  },
  [EVT_START_APP]() {
    browser.runtime.sendMessage( EVT_START_APP );
  }
};

export default events;
