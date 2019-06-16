import axios from "axios";
import { API_URL } from "../../constants";
import { TOKEN_EXPIRED, USER_IDLE } from "../../error-types";

const Api = {
  fetchTokensAndUser( uri ) {
    return axios.get( uri ).catch( error => {
      // todo
    });
  },
  fetchUserFromSpotify( accessToken ) {
    const url = "https://api.spotify.com/v1/me";
    return axios
      .get( url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .catch( error => {
        // todo
      });
  },
  refreshAccessToken( refreshToken, cluster ) {
    return axios
      .get( `${API_URL}/refresh_token?token=${refreshToken}&cluster=${cluster}` )
      .catch( error => {
        // todo
      });
  },
  getCoordinates( location ) {
    return axios
      .get( `${API_URL}/get_coords?location=${location}` )
      .catch( error => {
        // todo
      });
  },
  compareSongs( accessToken, songId ) {
    return axios
      .get( `${API_URL}/compare_songs?token=${accessToken}&songId=${songId}` )
      .then( res => {
        if ( res.status === 204 ) {
          throw new Error( USER_IDLE );
        }
        return res;
      })
      .catch( error => {
        if ( error.response && error.response.status === 401 ) {
          throw new Error( TOKEN_EXPIRED );
        } else if ( error.message === USER_IDLE ) {
          throw new Error( USER_IDLE ); // forward the error to the engine catch block
        }
      });
  },
  checkPerformances( artist, latitude, longitude, travelDistance ) {
    return axios
      .get(
        `${API_URL}/check_performances?artist=${artist}&latitude=${latitude}&longitude=${longitude}&travelDistance=${travelDistance}`
      )
      .catch( error => {
        if ( error.response && error.response.status === 401 ) {
          throw new Error( TOKEN_EXPIRED );
        }
      });
  }
};

export default Api;
