export const API_URL = process.env.BUILD_API_URL;
export const DEFAULT_REMINDER_TIME = 86400000; // 24 hours in milliseconds;
export const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SENTRY_DSN = process.env.SENTRY_DSN_URL;
export const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-read-playback-state"
];

/**
 *
 * In purpose of optimisation the app runs in 4 cycles.
 * The cycle times are based on user song skipping data
 * (https://musicmachinery.com/2014/05/02/the-skip/).
 * Cycle 1 has ~30% chance of a skip
 * Cycle 2 has ~35% chance of a skip
 * Cycle 3 can be dynamically calculated to be the remaining
 * song time or a predefined value (~48% chance of a skip)
 * Cycle 4 assumes that the user stopped listening to music
 * and will occasionally check if user activity has renewed
 */
export const CYCLE_1 = process.env.NODE_ENV === "development" ? 5000 : 10000; // 10 seconds
export const CYCLE_2 = process.env.NODE_ENV === "development" ? 5000 : 30000; // 30 seconds
export const CYCLE_3 = process.env.NODE_ENV === "development" ? 5000 : 15000; // 15 seconds
export const CYCLE_4 = process.env.NODE_ENV === "development" ? 5000 : 300000; // 5 minutes
