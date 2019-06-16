import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Spinner from "vue-simple-spinner";
import Loading from "./index.vue";

const localVue = createLocalVue();

localVue.use( Vuex );

describe( "Loading Page", () => {
  let store;

  beforeEach( () => {
    store = new Vuex.Store();
  });

  it( "renders component", () => {
    const wrapper = shallowMount( Loading, { store, localVue });
    expect( wrapper.element ).toMatchSnapshot();
    expect( wrapper.contains( Spinner ) ).toBe( true );
  });
});
