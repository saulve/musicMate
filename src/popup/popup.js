import Vue from "vue";
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons/brands/spotify";
import "vue-awesome/icons/heart";
import { SENTRY_DSN } from "../common/constants";

import App from "./App.vue";
import store from "../store";
import router from "./router";
import "../styles";

if ( process.env.NODE_ENV === "production" ) {
  Raven.config( SENTRY_DSN )
    .addPlugin( RavenVue, Vue )
    .install();
}

Vue.component( "icon", Icon );
/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { icon: Icon },
  render: h => h( App )
});
