# Google Sheets / Google Calendar / Google Forms Appointments Scheduler
This is a simple appointment scheduling script that integrates Google Forms,
Sheets, and Calendar into a cohesive flow. The program comes up with a list of
available appointment times using your existing Google Calendar, adds them to a 
Google Form, keeps that Form updated, and automatically adds Calendar events
when someone signs up for an appointment. 
## How It Works
In order to better understand if this is the program for you, here is what it
does:
1. You input your preferences, such as when the earliest appointments can be.
2. The script looks at all possible appointment times in a range determined by
   your proferences, and keeps only the ones for which you don't have any events
   or appointments already (based on your Google Calendar).
3. The script automatically populates those times into a Google Forms question.
4. Your users view the Google Form and choose from one of many appointments, all
   guarunteed to be available based on your schedules.
5. The script recieves the form submission and:
    1. Adds the appointment to your Calendar.
    2. Invites the user to the appointment using their email.
    3. Automatically updates the available times so that the time is not available
       anymore.
## Setting It Up
If this sounds like the system you've been looking for, here's how you can set
it up for yourself:
1. Create a [Google Sheet](https://sheets.google.com). You can name it whatever
   you'd like. Alternatively, you can just make a new worksheet in an existing 
   Sheet file.
2. Rename the worksheet (**Sheet1** if you just made a new Google Sheet) to
   something meaningful, ie **Appointment Signups**.
3. Use _Tools_ → _Create a Form_ to make a new Google Form linked to the
   worksheet you just renamed. You can name the Form anything you'd like.
4. Add the form questions. You need the following:
    1. Turn on _Collect email addresses_ in the settings in the gear menu in the
       top right, OR create a _Short answer_-type question asking for their
       email address. Call this **Email Address** or take note of what you call it.
    2. Create a _Short answer_-type question asking for the user's name. Call
       Call this **Name** or take note of what you call it.
    3. Create a _Multiple choice_-type question asking for the user to select a
       time. I reccommend noting what time zone you are in and how long the
       appointments will take in the description for this question. You can
       leave the options empty; they will be automatically filled. Call this
       **Selected Appointment Time** or take note of what you call it. 
5. Back in the Google Sheet you created, go to _Tools_ → _Script Editor_. This
   will open a new tab with a Google Apps Script project. Rename this to the
   same name you called the Google Sheet.
6. In the script project, create two new files using _File_ → _New_ → _Script
   File_. Call one of them **`moment.gs`** and the other **`settings.gs`**.
7. Copy and paste the contents of [`Code.gs`](https://raw.githubusercontent.com/iansan5653/google-appointment-scheduler/master/Code.gs),
   [`moment.gs`](https://raw.githubusercontent.com/iansan5653/google-appointment-scheduler/master/moment.gs),
   and [`settings.gs`](https://raw.githubusercontent.com/iansan5653/google-appointment-scheduler/master/settings.gs)
   from this repository to your new script project.
8. Configure `settings.gs` in your script project using the descriptions provided
   for each setting. This is important! Be careful with each setting to get it
   right.
9. In the script project, create a time-based trigger: click the clock icon
    next to the save icon, click _+ Add Trigger_. Under _Choose which function
    to run_, choose `updateAppointmentsTimeslots`. Under _Select event source_
    choose _Time-driven_. Click _Save_.

