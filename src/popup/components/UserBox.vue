<template>
  <div 
    v-if="avatar" 
    class="flex flex--end relative">
    <img 
      :src="avatar" 
      :title="`Hey ${userName}!`"
      class="avatar border-rad-full"
      @error="onImageLoadError">
  </div>
</template>

<script>
import defaultAvatar from "../../icons/defaultAvatar.svg";
import Api from "../../common/services/api";
import { UPDATE_USER } from "../../store/action-types";

export default {
  data() {
    return { avatar: null, userName: null };
  },
  mounted() {
    this.$store.watch(
      state => state.user,
      user => {
        if ( user ) {
          this.avatar = user.images[0].url;
          this.userName = user.display_name.split( " " )[0]; // get just the first name;
        }
      }
    );
  },
  methods: {
    async onImageLoadError() {
      const { data } = await Api.fetchUserFromSpotify(
        this.$store.getters.accessToken
      );
      if ( data.images.length ) {
        this.avatar = data.images[0].url;
        this.$store.dispatch( UPDATE_USER, data ); // cache user with new images
      } else {
        this.avatar = defaultAvatar;
      }
    }
  }
};
</script>
