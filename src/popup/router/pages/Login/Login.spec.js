// import { render, fireEvent, cleanup } from "@testing-library/vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import TestHelper from "../../../../common/services/test-helper";
import Login from "./index.vue";

const localVue = createLocalVue();

localVue.use( Vuex );

describe( "Login Page", () => {
  let actions;
  let store;
  let stubs;

  beforeEach( () => {
    actions = {
      loginToSpotify: jest.fn()
    };
    store = new Vuex.Store({
      namespaced: true,
      state: {},
      actions
    });
    stubs = ["icon"];
  });

  it( "must render the component", () => {
    const wrapper = TestHelper.mountComponent( Login, localVue, store, stubs );
    expect( wrapper.element ).toMatchSnapshot();
    const loginButton = wrapper.find( "button" );
    expect( loginButton.text() ).toBe( "Login with Spotify" );
  });

  it( "must call login action when login button is clicked", async () => {
    const wrapper = TestHelper.mountComponent( Login, localVue, store, stubs );
    wrapper.find( "button" ).trigger( "click" );
    expect( actions.loginToSpotify ).toHaveBeenCalled();
  });
});
