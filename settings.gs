/** 
 * ID of the Google Calendar to add appointments to. You can get this ID from
 * a calendar's "Settings and Sharing" page, under "Integrate calendar", as
 * "Calendar ID". It's typically an email address but may have a string of
 * random characters.
 * The person setting this up must have access to read and write to the calendar.
 * @type {string}
 */
var APPOINTMENTS_CALENDAR_ID = 'example@group.calendar.google.com';
/**
 * List of Google Calendar IDs to check for existing events. Will not allow
 * appointment signups if these calendars have any events already. This list
 * should probably include `APPOINTMENTS_CALENDAR_ID` to avoid scheduling two
 * appointments at the same time.
 * The person setting this up must have access to read all of the calendars.
 * @type {string[]}
 */
var BUSY_CALENDARS = [
    'usfsoar@gmail.com',
    APPOINTMENTS_CALENDAR_ID
];
/**
 * Name of the column in the Google Sheet linked to the signup Form that contains
 * the submitter's email address. If you have turned on "Collect Email Addresses"
 * for the Form, this will be 'Email Address'.
 * @type {string}
 */
REQUESTS_SHEET_EMAIL_COL = 'Email Address';
/**
 * Name of the column in the Google Sheet linked to the signup Form that contains
 * the submitter's name. This is the same as the name of the question
 * on the Form that asks for their name.
 * @type {string}
 */
REQUESTS_SHEET_NAME_COL = 'Name';
/**
 * Name of the column in the Google Sheet linked to the signup Form that contains
 * the submitter's signup time. This is the same as the name of the question
 * on the Form that asks for their signup time.
 * @type {string}
 */
REQUESTS_SHEET_TIME_COL = 'Selected Appointment Time';
/**
 * Whether or not to allow scheduling appointments on weekends.
 * @type {bool}
 */
ALLOW_WEEKEND_APPOINTMENTS = false;
/**
 * If weekend scheduling is disallowed, this sets the start time of the weekend
 * on Fridays. Must be on the hour (ie NOT 6:30). Given as a 24-hour hour, so
 * 6:00 am becomes 6, 5:00 pm becomes 17. Never add a leading 0 (ie NOT 06).
 * @type {number}
 */
WEEKENDS_FRIDAY_START_TIME = 15;
/**
 * Earliest time someone can schedule an appointments for. Same format as
 * `WEEKENDS_FRIDAY_START_TIME`.
 * @type {number}
 */
EARLIEST_APPOINTMENT_TIME = 9;
/**
 * Latest time someone can schedule an appointments for. Same format as
 * `WEEKENDS_FRIDAY_START_TIME`.
 * @type {number}
 */
LATEST_APPOINTMENT_TIME = 18;
/**
 * Minimum number of hours in advance that someone can schedule appointments. 
 * For example, if it's 24, nobody can schedule same-day appointments.
 * @type {string}
 */
MIN_ADVANCE_REQUEST_HOURS = 36;
/**
 * Maximum number of days in advance that someone can schedule appointments. 
 * For example, if it's 7, appointments can be scehduled up to one week in
 * advance. This should be kept reasonably small to avoid giving an overwhelming
 * number of options for interview times.
 * @type {string}
 */
MAX_ADVANCE_REQUEST_DAYS = 7;
/**
 * Length of an interview. This should include setup and breakdown time, as
 * interview timeslots will be back-to-back. This should be a factor of 60 or
 * the timeslot list will be inconsistent and change every hour.
 * @type {string}
 */
APPOINTMENT_LENGTH_MINUTES = 30;
/**
 * Format of the times to display to the user. See the link for more info.
 * @see {@link https://momentjs.com/docs/#/parsing/string-format/}
 * @type {string}
 */
TIME_FORMAT = 'dddd, MMM D, YYYY @ h:mm a';
/**
 * Text to add at the beginning of added calendar events.
 * @type {string}
 */
APPOINTMENT_EVENT_NAME_SUFFIX = ' Interview';
/**
 * Text to add at the beginning of added calendar events.
 * @type {string}
 */
APPOINTMENT_EVENT_NAME_PREFIX = '(Requested) ';