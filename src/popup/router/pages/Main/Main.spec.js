// import { render, fireEvent, cleanup } from "@testing-library/vue";
import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Spinner from "vue-simple-spinner";
import TestHelper from "../../../../common/services/test-helper";
import Main from "./index.vue";

const localVue = createLocalVue();

localVue.use( Vuex );

describe( "Main Page", () => {
  let actions;
  let store;
  let stubs;
  let wrapper;

  function mountComponentWithStore( store ) {
    const attachToDocument = true;
    return TestHelper.mountComponent(
      Main,
      localVue,
      store,
      stubs,
      attachToDocument
    );
  }

  beforeEach( () => {
    actions = {
      changeMessage: jest.fn()
    };
    stubs = ["icon"];

    store = new Vuex.Store({
      namespaced: true,
      state: {
        currentLocation: "testCurrent location"
      },
      actions,
      getters: {
        readyToRun: () => false
      }
    });
  });

  it( "must not render confirmation window if the app is not ready to run", () => {
    wrapper = mountComponentWithStore( store );
    expect( wrapper.element ).toMatchSnapshot();
    expect( wrapper.find( ".confirmation__status" ).exists() ).toBe( false );
  });

  it( "must render confirmation window if the app is ready to run", () => {
    store.hotUpdate({
      getters: {
        readyToRun: () => true
      }
    });
    wrapper = mountComponentWithStore( store );
    expect( wrapper.element ).toMatchSnapshot();
    expect( wrapper.find( ".confirmation__status" ).exists() ).toBe( true );
    expect(
      wrapper
        .find( ".confirmation__message" )
        .text()
        .trim()
    ).toEqual( "I'll notify you if I find any performances" );
  });

  // describe( "location form", () => {
  //   it( "must render the form element when ", () => {
  //     expect( wrapper.element ).toMatchSnapshot();
  //     // console.log( wrapper.html() );
  //     // const wrapper = mount( Main, localVue, store );
  //     // expect( true ).toBe( true );
  //     // wrapper.debug();
  //     // expect( wrapper.element ).toMatchSnapshot();
  //     // const loginButton = wrapper.find( ".confirmation__status" );
  //     // expect( loginButton.text() ).toBe( "The app is running" );
  //   });
  // });

  //   it( "must call login action when login button is clicked", async () => {
  //     const wrapper = TestHelper.mountComponent( Main, localVue, store, stubs );
  //     wrapper.find( "button" ).trigger( "click" );
  //     expect( actions.loginToSpotify ).toHaveBeenCalled();
  //   });
});
