const HelperService = {
  retrieveClosestPerformance( performances ) {
    if ( performances && performances.length ) {
      const closestPerformance = performances.reduce(
        ( prev, curr ) => ( prev.distance < curr.distance ? prev : curr )
      );
      return closestPerformance.performance;
    }
    return null;
  },
  isNotificationCached( notifications, performance ) {
    const found = notifications.find( entry => entry.id === performance.id );
    if ( found ) {
      return true;
    }
    return false;
  },
  isReminderDue( reminders ) {
    const dueReminder = reminders.findIndex(
      entry => entry.deadline <= new Date().getTime()
    );
    return dueReminder;
  }
};

export default HelperService;
