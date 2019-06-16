/* eslint-disable-next-line import/no-extraneous-dependencies */
import { mount } from "@vue/test-utils";

const TestHelper = {
  mountComponent( component, localVue, store, stubs, attachToDocument ) {
    const wrapper = mount( component, {
      localVue,
      store,
      stubs,
      attachToDocument
    });

    return wrapper;
  }
};

export default TestHelper;
