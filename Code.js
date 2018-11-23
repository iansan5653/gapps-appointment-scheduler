// Constants
var 
  INTERVIEWS_CALENDAR_ID = 'mail.usf.edu_skqvsj7a53obnvqdf46a18bves@group.calendar.google.com',
  BUSY_CALENDARS = [
    'usfsoar@gmail.com',
    INTERVIEWS_CALENDAR_ID
  ],
  INTERVIEWS_SHEET_EMAIL_COL = 'Email Address',
  INTERVIEWS_SHEET_NAME_COL = 'Full name',
  INTERVIEWS_SHEET_TIME_COL = 'Selected interview time',
  ALLOW_WEEKEND_INTERVIEWS = false,
  WEEKENDS_FRIDAY_START_TIME = 15, // Hour, without leading 0, in 24hr time, when the weekend starts on Fridays
  EARLIEST_INTERVIEW_TIME = 9, // Hour, without leading 0, in 24hr time
  LATEST_INTERVIEW_TIME = 18, // Hour, without leading 0, in 24hr time
  MIN_ADVANCE_INTERVIEW_HOURS = 36,
  MAX_ADVANCE_INTERVIEW_DAYS = 11,
  INTERVIEW_LENGTH_MINUTES = 30,
  TIME_FORMAT = 'dddd, MMM D, YYYY @ h:mm a',
  INTERVIEW_EVENT_NAME_SUFFIX = ' Interview';

/**
 * Code to automatically run on form submit.
 * @param {Object} e Google Event object.
 */
function onFormSubmit(e) {
  handleInterviewRequest(e.namedValues);
}

/**
  * Test handling of interview time requests.
  */
function testHandleInterviewRequest() {
  var sampleData = {};
  sampleData[INTERVIEWS_SHEET_TIME_COL] = "Monday, Nov 26, 2018 @ 7:00 pm";
  sampleData[INTERVIEWS_SHEET_NAME_COL] = "John Doe";
  sampleData[INTERVIEWS_SHEET_EMAIL_COL] = "iansanders@mail.usf.edu";
  handleInterviewRequest(sampleData);
}

/**
 * Handle an interview time request.
 * @param {Object} data Form submission data with columns as property keys.
 */
function handleInterviewRequest(data) {
  var interviewsCalendar = CalendarApp.getCalendarById(INTERVIEWS_CALENDAR_ID);
  var requestedTime = moment(data[INTERVIEWS_SHEET_TIME_COL], TIME_FORMAT);
  var requestedTimeEnd = requestedTime
    .clone()
    .add(INTERVIEW_LENGTH_MINUTES, 'minutes');
  var eventName =
    '(Requested) ' +
    data[INTERVIEWS_SHEET_NAME_COL] +
    INTERVIEW_EVENT_NAME_SUFFIX;

  interviewsCalendar
    .createEvent(eventName, requestedTime.toDate(), requestedTimeEnd.toDate())
    .addGuest(data[INTERVIEWS_SHEET_EMAIL_COL]);

  updateInterviewTimeslots();
}

/**
 *  Pull data from Google Calendar and calculate available interview times
 */
function updateInterviewTimeslots() {
  busyCalendars = BUSY_CALENDARS.map(function(calendarId){
    return CalendarApp.getCalendarById(calendarId);
  })

  var now = moment().startOf('hour'); // Back in time to the start of this hour
  var timeRangeStart = now.clone().add(MIN_ADVANCE_INTERVIEW_HOURS, 'hours');
  var timeRangeEnd = timeRangeStart
    .clone()
    .add(MAX_ADVANCE_INTERVIEW_DAYS, 'days');

  var availableTimes = [];

  // Loop through every interview interval
  for (
    var m = timeRangeStart;
    m.isSameOrBefore(timeRangeEnd);
    m.add(INTERVIEW_LENGTH_MINUTES, 'minutes')
  ) {
    mEnd = m.clone().add(INTERVIEW_LENGTH_MINUTES, 'minutes');
    mDate = m.toDate();
    mEndDate = mEnd.toDate();

    if (
      m.hour() >= EARLIEST_INTERVIEW_TIME &&
      m.hour() <= LATEST_INTERVIEW_TIME && // In time range
      (ALLOW_WEEKEND_INTERVIEWS || !isOnWeekend(m)) // And (weekends allowed or not on a weekend)
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

  updateInterviewSignupTimes(availableTimes);
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
function updateInterviewSignupTimes(times) {
  var applicationForm = getLinkedForm();
  var multiChoiceItems = applicationForm.getItems();
  var timeList;
  for (var i = multiChoiceItems.length - 1; i >= 0; i--) {
    var item = multiChoiceItems[i];
    if (
      item.getTitle() === INTERVIEWS_SHEET_TIME_COL
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
