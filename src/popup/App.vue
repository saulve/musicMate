<template>
  <div class="container">
    <user-box/>
    <div 
      v-if="message" 
      :class="{'message__error': message.error,
               'message__warning': !message.error}"
      class="text-center message">
      {{ message.text }}
    </div>
    <router-view/>
  </div>
</template>

<script>
import UserBox from "./components/UserBox.vue";

export default {
  components: {
    "user-box": UserBox
  },
  data() {
    return {};
  },
  computed: {
    message() {
      return this.$store.getters.message;
    }
  }
};
</script>
