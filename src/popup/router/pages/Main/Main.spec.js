import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import flushPromises from "flush-promises";
import TestHelper from "../../../../common/services/test-helper";
import Main from "./index.vue";

const localVue = createLocalVue();

localVue.use( Vuex );
jest.mock( "debounce", () => jest.fn( fn => fn ) );

describe( "Main Page", () => {
  let store;
  let stubs;
  let wrapper;
  let defaultGetters;
  let defaultActions;
  let mockLocations;

  function mountComponentWithStore( vuexStore ) {
    const attachToDocument = true;
    return TestHelper.mountComponent(
      Main,
      localVue,
      vuexStore,
      stubs,
      attachToDocument
    );
  }

  beforeEach( () => {
    mockLocations = {
      data: [{ address: { formattedAddress: "mockSearchLocationResult" } }]
    };
    defaultGetters = {
      readyToRun: () => false,
      notifications: () => [],
      currentLocation: () => "mockLocation"
    };
    defaultActions = {
      changeMessage: jest.fn(),
      clearMessage: jest.fn(),
      fetchLocation: jest.fn().mockResolvedValue( mockLocations )
    };
    stubs = ["icon"];

    store = new Vuex.Store({
      namespaced: true,
      state: {
        currentLocation: "testCurrent location"
      },
      actions: defaultActions,
      getters: defaultGetters
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
        ...defaultGetters,
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

  // TODO
  // it( "must show the form if the app is not ready to run", () => {});

  // TODO
  // describe( "Show settings button", () => {
  // it( "must not show the button if the app is not ready to run", () => {
  // });
  // it( "must show the  form if the 'Show settings' button is clicked", () => {
  // });
  // });

  describe( "Current location input", () => {
    beforeEach( () => {
      jest.useFakeTimers();
    });

    // TODO
    // it( "must set current location input value from store", () => {});
    // it( "must add error class if location is not valid ", () => {});
    // it( "must save the selected location from the search when a result is clicked", () => {});

    describe( "on location change", () => {
      it( "must fetch locations when current location changes to a non-empty string", () => {
        wrapper = mountComponentWithStore( store );
        const expected = "testLocation";
        const locationInput = wrapper.find( "#currentLocation" );
        expect( locationInput.isVisible() ).toBe( true );
        locationInput.setValue( expected );
        jest.runAllTimers();
        expect( defaultActions.fetchLocation ).toHaveBeenCalled();
      });

      it( "must show 'no location' message when current location gets erased", () => {
        wrapper = mountComponentWithStore( store );
        const locationInput = wrapper.find( "#currentLocation" );
        locationInput.setValue( "" );
        jest.runAllTimers();
        expect( defaultActions.changeMessage ).toHaveBeenCalled();
        expect( defaultActions.fetchLocation ).not.toHaveBeenCalled();
      });

      it( "must set location state if search has results", async () => {
        wrapper = mountComponentWithStore( store );
        const locationInput = wrapper.find( "#currentLocation" );
        locationInput.setValue( "mockLocation" );
        jest.runAllTimers();
        expect( defaultActions.fetchLocation ).toHaveBeenCalled();
        await flushPromises();
        expect( wrapper.vm.loading ).toBe( false );
        expect( wrapper.vm.locations ).toBe( mockLocations.data );
      });

      describe( "if there's no results from search", () => {
        it( "must show message for 'location not found'", async () => {
          const newFetchLocationMock = jest
            .fn()
            .mockResolvedValue({ data: [] });
          store.hotUpdate({
            actions: {
              ...defaultActions,
              fetchLocation: newFetchLocationMock
            }
          });
          wrapper = mountComponentWithStore( store );
          const locationInput = wrapper.find( "#currentLocation" );
          locationInput.setValue( "mockLocation" );
          jest.runAllTimers();
          expect( wrapper.vm.loading ).toBe( true );
          expect( defaultActions.clearMessage ).toHaveBeenCalled();
          expect( newFetchLocationMock ).toHaveBeenCalled();
          await flushPromises();
          expect( defaultActions.changeMessage ).toHaveBeenCalled();
        });

        it( "must nullify location state and toggle loading state", async () => {
          const newFetchLocationMock = jest
            .fn()
            .mockResolvedValue({ data: [] });
          store.hotUpdate({
            actions: {
              ...defaultActions,
              fetchLocation: newFetchLocationMock
            }
          });
          wrapper = mountComponentWithStore( store );
          const locationInput = wrapper.find( "#currentLocation" );
          locationInput.setValue( "mockLocation" );
          jest.runAllTimers();
          expect( wrapper.vm.loading ).toBe( true );
          expect( newFetchLocationMock ).toHaveBeenCalled();
          await flushPromises();
          expect( wrapper.vm.loading ).toBe( false );
          expect( wrapper.vm.locations ).toBeNull();
        });
      });
    });
  });

  // TODO
  // describe( "Location list", () => {
  // it( "must show a spinner when the app is loading", () => {});
  // it( "must display fetched locations", () => {});
  // it( "must save the selected location from search when a result is clicked", () => {});
  // });

  // TODO
  // describe( "Travel distance input", () => {
  // it( "must show travel distance from the store", () => {});
  // it( "must add a temporary message and update store when input value changes", () => {});
  // it( "must must display the expected distance when input value changes", () => {});
  // });

  // TODO
  // describe( "Recent discoveries", () => {
  // it( "must show recent discoveries from the store", () => {});
  // it( "must capture that a recent discovery was clicked", () => {});
  // });
});
