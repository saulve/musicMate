<template>
  <spinner/>
</template>

<script>
import Spinner from "vue-simple-spinner";

export default {
  components: {
    spinner: Spinner
  },
  data() {
    return {};
  },
  mounted() {
    /**
     *
     * I takes a bit of time for the background store instance
     * to be copied into the newly instantiated popup store
     * therefore we're watching for the change and only proceed
     * when both states (background and popup) are in sync
     */
    this.$store.watch(
      state => state.timer,
      () => {
        if ( this.$store.getters.isLoggedIn ) {
          this.$router.push( "/main" );
        } else {
          this.$router.push( "/login" );
        }
      }
    );
  }
};
</script>
