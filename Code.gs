/**
 * Code to automatically run on form submit.
 * @param {Object} e Google Event object.
 */
function onFormSubmit(e) {
  handleAppointmentRequest(e.namedValues);
}

/**
  * Test handling of interview time requests.
  */
function testHandleAppointmentRequest() {
  var sampleData = {};
  sampleData[REQUESTS_SHEET_TIME_COL] = "Monday, Nov 26, 2018 @ 7:00 pm";
  sampleData[REQUESTS_SHEET_NAME_COL] = "John Doe";
  sampleData[REQUESTS_SHEET_EMAIL_COL] = "johndoe@example.com";
  handleAppointmentRequest(sampleData);
}

/**
 * Handle an interview time request.
 * @param {Object} data Form submission data with columns as property keys.
 */
function handleAppointmentRequest(data) {
  var appointmentsCalendar = CalendarApp.getCalendarById(APPOINTMENTS_CALENDAR_ID);
  var requestedTime = moment(data[REQUESTS_SHEET_TIME_COL], TIME_FORMAT);
  var requestedTimeEnd = requestedTime
    .clone()
    .add(APPOINTMENT_LENGTH_MINUTES, 'minutes');
  var eventName =
    APPOINTMENT_EVENT_NAME_PREFIX +
    data[REQUESTS_SHEET_NAME_COL] +
    APPOINTMENT_EVENT_NAME_SUFFIX;

  appointmentsCalendar
    .createEvent(eventName, requestedTime.toDate(), requestedTimeEnd.toDate())
    .addGuest(data[REQUESTS_SHEET_EMAIL_COL]);

  updateAppointmentsTimeslots();
}

/**
 *  Pull data from Google Calendar and calculate available interview times
 */
function updateAppointmentsTimeslots() {
  busyCalendars = BUSY_CALENDARS.map(function(calendarId){
    return CalendarApp.getCalendarById(calendarId);
  })

  var now = moment().startOf('hour'); // Back in time to the start of this hour
  var timeRangeStart = now.clone().add(MIN_ADVANCE_REQUEST_HOURS, 'hours');
  var timeRangeEnd = timeRangeStart
    .clone()
    .add(MAX_ADVANCE_REQUEST_DAYS, 'days');

  var availableTimes = [];

  // Loop through every interview interval
  for (
    var m = timeRangeStart;
    m.isSameOrBefore(timeRangeEnd);
    m.add(APPOINTMENT_LENGTH_MINUTES, 'minutes')
  ) {
    mEnd = m.clone().add(APPOINTMENT_LENGTH_MINUTES, 'minutes');
    mDate = m.toDate();
    mEndDate = mEnd.toDate();

    if (
      m.hour() >= EARLIEST_APPOINTMENT_TIME &&
      m.hour() <= LATEST_APPOINTMENT_TIME && // In time range
      (ALLOW_WEEKEND_APPOINTMENTS || !isOnWeekend(m)) // And (weekends allowed or not on a weekend)
    ) {
      numExistingEvents = 0;
      for(var i = 0; i < busyCalendars.length; i++) {
        if (numExistingEvents === 0) {
          numExistingEvents += busyCalendars[i].getEvents(mDate, mEndDate).length;
        }
      }
      if (numExistingEvents === 0) availableTimes.push(m.clone());
    }
  }

  updateAppointmentSignupTimes(availableTimes);
}

/**
 * Checks if the given time is on a weekend.
 * @param {Moment} time
 */
function isOnWeekend(time) {
  return (
    time.day() === 0 ||
    time.day() === 6 ||
    (WEEKENDS_FRIDAY_START_TIME &&
      time.day() === 5 &&
      time.hour() >= WEEKENDS_FRIDAY_START_TIME)
  );
}

/**
 * Update the interview time signup form.
 * @param {Moment[]} times Array of available interview times as moment objects.
 */
function updateAppointmentSignupTimes(times) {
  var applicationForm = getLinkedForm();
  var multiChoiceItems = applicationForm.getItems();
  var timeList;
  for (var i = multiChoiceItems.length - 1; i >= 0; i--) {
    var item = multiChoiceItems[i];
    if (
      item.getTitle() === REQUESTS_SHEET_TIME_COL
    ) {
      timeList = item;
    }
  }

  times = times.map(function(time) {
    return time.format(TIME_FORMAT);
  });

  timeList.asMultipleChoiceItem().setChoiceValues(times);
}

/**
 * Fetch the Google Form linked to the current spreadsheet.
 * @returns {GoogleAppsScript.Forms.Form}
 */
function getLinkedForm() {
  return FormApp.openByUrl(SpreadsheetApp.getActiveSpreadsheet().getFormUrl());
}
