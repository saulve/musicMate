import { browser } from "webextension-polyfill-ts";
import reminderImg from "../../../icons/reminder.png";
import confirmImg from "../../../icons/checked.png";
import musicMateIcon from "../../../icons/music-mate-128.png";
import ticketsIcon from "../../../icons/tickets.png";

const NotificationService = {
  // TODO: Add checks for when's the performance
  // to not display the button if the performance is today
  createNotificationObject( closestPerformance, currentMusic ) {
    const date = this.dateAsString( closestPerformance.datetime );

    const notification = {
      type: "image",
      message: `On ${date} at ${closestPerformance.venue.city}, ${
        closestPerformance.venue.name
      }`,
      title: `${currentMusic.artist} is performing near you`,
      imageUrl: currentMusic.images[0].url,
      items: [],
      buttons: [],
      iconUrl: musicMateIcon,
      requireInteraction: true
    };

    // Create a 'Remind me tomorrow' button
    notification.buttons.push(
      {
        title: "Remind me tomorrow",
        iconUrl: reminderImg
      },
      {
        title: "Show tickets",
        iconUrl: ticketsIcon
      }
    );

    const notificationWrapper = {
      popupObj: notification,
      datetime: closestPerformance.datetime,
      artist: currentMusic.artist,
      ticketUrl: closestPerformance.offers[0].url,
      id: closestPerformance.id
    };

    return notificationWrapper;
  },
  createReminderObject( artist, currNotif, time ) {
    const notification = {
      type: "basic",
      title: `Reminder for ${artist} performance created!`,
      message: `I will remind you about it on ${this.dateAsString( time )}`,
      iconUrl: confirmImg
    };

    return {
      popup: notification,
      notification: currNotif,
      deadline: time
    };
  },
  /**
   * TODO: firefox currently only supports 'basic' notifications
   */
  createNotificationPopup( notification ) {
    // Show notification
    browser.notifications.create( "", notification );
  },
  clearNotification( notificationId ) {
    browser.notifications.clear( notificationId );
  },
  dayOfWeekAsString( dayIndex ) {
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ][dayIndex];
  },
  monthAsAString( monthIndex ) {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ][monthIndex];
  },
  dateAsString( date ) {
    let dateAsString = new Date( date );
    dateAsString = `${this.dayOfWeekAsString(
      dateAsString.getDay()
    )}, ${this.monthAsAString(
      dateAsString.getMonth()
    )} ${dateAsString.getDate()}, ${dateAsString.getFullYear()}`;

    return dateAsString;
  }
};

export default NotificationService;
