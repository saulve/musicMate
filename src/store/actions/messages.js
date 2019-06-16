import { CHANGE_MSG, CLEAR_MSG, ADD_TEMPORARY_MSG } from "../action-types";
import { SET_MESSAGE } from "../mutation-types";

const messageActions = {
  [CHANGE_MSG]({ commit }, message ) {
    commit( SET_MESSAGE, message );
  },
  [ADD_TEMPORARY_MSG]({ commit, dispatch }, message ) {
    commit( SET_MESSAGE, message );
    setTimeout( () => {
      dispatch( CLEAR_MSG );
    }, 2000 );
  },
  [CLEAR_MSG]({ commit }) {
    commit( SET_MESSAGE, null );
  }
};

const LOCATION_NOT_FOUND = {
  error: true,
  text: "Hmmm.. I can't find this location"
};
const NO_LOCATION = {
  text: "Enter a location"
};
const SAVED = {
  text: "Your settings have been saved!"
};

export default messageActions;
export { LOCATION_NOT_FOUND, NO_LOCATION, SAVED };
