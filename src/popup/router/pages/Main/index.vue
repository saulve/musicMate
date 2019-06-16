<template>
  <div class="flex flex--column">
    <!-- Running confirmation -->
    <div v-if="readyToRun" 
class="margin-top-10 flex flex--column align--items">
      <h3 class="confirmation__status">
        The app is running
        <icon name="heart" 
class="confirmation__heart"/>
      </h3>
      <span class="confirmation__message">I'll notify you if I find any performances</span>
    </div>
    <!-- User settings -->
    <form v-if="showForm" 
id="mmForm">
      <!-- Current location -->
      <div class="margin-top-10">
        <label for="currentLocation" 
class="mm--label">
          My location
          <img :src="compassImg" 
class="mm--label-svg">
        </label>
        <input
          id="currentLocation"
          :class="{'mm--input-error': isLocationInvalid}"
          v-model="currentLocation"
          class="input border-rad--std settings__location margin-top-10"
          type="text"
          name="currentLocation"
          placeholder="e.g. London"
          required
          autocomplete="off"
          title="Where should I look for concerts?"
          @input="locationChange"
        >
      </div>

      <!-- Spinner -->
      <spinner v-if="loading" 
class="margin-top-20"/>
      <!-- Location list -->
      <ul v-if="locations" 
class="locations__list">
        <li
          v-for="location in locations.slice(0, 3)"
          @click="saveLocation(location)"
        >{{ location.address.formattedAddress }}</li>
      </ul>
      <!-- Max distance input -->
      <div class="margin-top-10">
        <label class="mm--label" 
for="travelDistance">
          Max distance
          <img :src="distanceImg" 
class="mm--label-svg">
        </label>
        <input
          id="travelDistance"
          v-model="travelDistance"
          class="margin-top-20"
          type="range"
          input-name="travelDistance"
          min="1"
          max="1000"
          name="travelDistance"
          required
          title="How far would you go for a concert?"
          @change="e => distanceChange(e)"
        >
        <span>{{ travelDistance }} km</span>
      </div>
    </form>
    <!-- Settings toggle -->
    <span
      v-if="readyToRun"
      class="button button--std input border-rad--std align--self margin-top-10"
      @click="showForm = !showForm"
    >{{ showForm ? "Hide settings" : "Show settings" }}</span>
    <!-- Recent discoveries -->
    <h3 v-if="notifications.length" 
class="recent-finds--title">recent discoveries</h3>
    <div v-if="notifications.length" 
class="recent-finds">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="recent-finds__item"
        @click="recentItemClicked"
      >
        <a
          :href="notification.ticketUrl"
          target="_blank"
          class="recent-finds__item-box flex flex--column align--items"
        >
          <img :src="notification.popupObj.imageUrl">
          <span class="recent-finds__item-box--artist">{{ notification.artist }}</span>
          <span
            class="recent-finds__item-box--date"
          >{{ new Date(notification.datetime).toLocaleString("en-GB").split(",")[0] }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Raven from "raven-js";
import debounce from "debounce";
import Spinner from "vue-simple-spinner";
import {
  FETCH_LOCATION,
  UPDATE_LOCATION,
  UPDATE_DISTANCE,
  CHANGE_MSG,
  ADD_TEMPORARY_MSG,
  EVT_START_APP,
  CLEAR_MSG
} from "../../../../store/action-types";
import {
  LOCATION_NOT_FOUND,
  NO_LOCATION,
  SAVED
} from "../../../../store/actions/messages";
import compassImg from "../../../../icons/compass.svg";
import distanceImg from "../../../../icons/distance.svg";

debounce.bind( this );

export default {
  components: {
    spinner: Spinner
  },
  data() {
    console.log( this.$store.getters );
    return {
      compassImg,
      distanceImg,
      currentLocation: null,
      travelDistance: this.$store.getters.travelDistance,
      loading: false,
      isLocationInvalid: null,
      locationEl: null,
      locations: null,
      showForm: true,
      notifications: [],
      readyToRun: this.$store.getters.readyToRun
    };
  },
  mounted() {
    console.log( "1" );
    console.log( document );
    this.locationEl = document.getElementById(
      "mmForm"
    ).elements.currentLocation;
    console.log( "2" );
    // set current location here to avoid invalid form state
    this.currentLocation = this.$store.getters.currentLocation;
    this.notifications = this.$store.getters.notifications;
    this.showForm = !this.$store.getters.readyToRun;
    console.log( "3" );
    // Prompt user to enter location at the start
    if ( !this.currentLocation ) {
      console.log( "4" );
      this.$store.dispatch( CHANGE_MSG, NO_LOCATION );
    }
    console.log( "5" );
    this.isLocationInvalid = this.locationEl.validity.valid;
  },
  methods: {
    locationChange: debounce( function result({ target: { value } }) {
      if ( value ) {
        this.loading = true;
        this.$store.dispatch( CLEAR_MSG );
        this.$store.dispatch( FETCH_LOCATION, value ).then( ({ data }) => {
          if ( data.length ) {
            this.loadResults( data );
          } else {
            this.locationEl.setCustomValidity( false );
            this.loadResults();
            this.$store.dispatch( CHANGE_MSG, LOCATION_NOT_FOUND );
          }
        });
      } else {
        this.$store.dispatch( CHANGE_MSG, NO_LOCATION );
        this.loadResults();
      }
    }, 800 ),
    loadResults( locations ) {
      this.loading = false;
      this.locations = locations || null;
    },
    saveLocation( location ) {
      this.locations = null;
      this.currentLocation = location.address.formattedAddress;
      this.$store.dispatch( UPDATE_LOCATION, location );
      this.$store.dispatch( ADD_TEMPORARY_MSG, SAVED );
      if ( this.$store.getters.readyToRun && !this.$store.getters.running ) {
        this.readyToRun = this.$store.getters.readyToRun;
        this.showForm = false;
        this.$store.dispatch( EVT_START_APP );
      }
    },
    distanceChange( e ) {
      this.$store.dispatch( UPDATE_DISTANCE, e.target.value );
      this.$store.dispatch( ADD_TEMPORARY_MSG, SAVED );
    },
    recentItemClicked() {
      Raven.captureMessage( "Tickets shown" );
    }
  }
};
</script>
