import { browser } from "webextension-polyfill-ts";

const LocalStorage = {
  getSavedState() {
    /**
     * TODO: add base64 encoding
     */
    return browser.storage.local.get( "mmState" );
  },
  saveState( state ) {
    browser.storage.local.set({ mmState: state });
  },
  deleteState() {
    browser.storage.local.remove( "mmState" );
  }
};

export default LocalStorage;
