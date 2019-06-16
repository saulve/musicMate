<template>
  <div class="login--box flex flex--column">
    <h2 class="text-center">Welcome to MusicMate!</h2>
    <button
      class="flex align--items align--self button button--lrg bkg-green color--white"
      @click="login"
    >
      <icon 
        name="brands/spotify" 
        class="color--white"/>Login with Spotify
    </button>
  </div>
</template>

<script>
import { LOGIN_TO_SPOTIFY } from "../../../../store/action-types";

export default {
  data() {
    return {};
  },
  methods: {
    login() {
      this.$store.dispatch( LOGIN_TO_SPOTIFY );
    }
  }
};
</script>
