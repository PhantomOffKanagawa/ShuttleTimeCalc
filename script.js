/** Class representing time */
class Time {
  /**
   * Create a time obj
   * @param {int} hours The hours value (0 - 24)
   * @param {int} minutes The minutes value (0 - 60)
   * TODO: Add range limits
   */
  constructor(hours, minutes) {
    this.hours = hours;
    this.minutes = minutes;
    this.addTime(0, 0)
  }

  /**
   * Adds an amount of time to a Time object and rolls up carried values
   * @param {int} hours Hours to add
   * @param {int} minutes Minutes to add
   * @returns {int} Total change in days carried over by hour addition
   */
  addTime(hours, minutes) {
    const minutesRemainder = Math.floor((this.minutes + minutes) / 60);
    const hoursRemainder = Math.floor(
      (this.hours + hours + minutesRemainder) / 24
    );
    this.minutes = (this.minutes + minutes) % 60;
    this.hours = (this.hours + hours + minutesRemainder) % 24;
    if (this.minutes < 0) this.minutes += 60;
    if (this.hours < 0) this.hours += 24;
    return hoursRemainder;
  }

  /**
   * Compare this time with another time value
   * @param {Time} time
   * @returns {int} negative int if this time is lower, 0 if equal, positive int if this time is higher
   */
  compare(time) {
    if (this.hours > time.hours) {
      return 1;
    } else if (this.hours < time.hours) {
      return -1;
    } else {
      return this.minutes - time.minutes;
    }
  }

  /**
   * Returns time as string
   * @returns {String} string representing the time in 24 hour format
   */
  toString() {
    return `${
      this.hours <= 9 ? `0${this.hours}` : this.hours
    }:${
      this.minutes <= 9 ? `0${this.minutes}` : this.minutes
    }`;
  }
}

function timeFromString(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Time(hours, minutes);
}

/** Class representing shuttle rules */
class ShuttleRules {
  constructor(start, end, interval, travel_time) {
    this.start = start;
    this.end = end;
    this.interval = interval;
    this.travel_time = travel_time;
  }
}

/** Class representing settings */
class Settings {
  constructor(AName, BName, AtoBRules, BtoARules) {
    this.AName = AName;
    this.BName = BName;
    this.AtoBRules = AtoBRules;
    this.BtoARules = BtoARules;
  }
}

var settings;
/** Manage Settings Load/Save */

/** Save Settings to Local Storage */
function saveSettings() {
  const settingsJSON = {

  };

  settingsJSON.AName = document.getElementById("AShuttleName").value;
  settingsJSON.BName = document.getElementById("BShuttleName").value;

  settingsJSON.AtoBRules = {};
  settingsJSON.AtoBRules.start = document.getElementById("fromAShuttleStart").value;
  settingsJSON.AtoBRules.end = document.getElementById("fromAShuttleEnd").value;
  settingsJSON.AtoBRules.interval = document.getElementById("fromAShuttleInterval").value;
  settingsJSON.AtoBRules.travel_time = document.getElementById("fromAShuttleLength").value;

  settingsJSON.BtoARules = {};
  settingsJSON.BtoARules.start = document.getElementById("fromBShuttleStart").value;
  settingsJSON.BtoARules.end = document.getElementById("fromBShuttleEnd").value;
  settingsJSON.BtoARules.interval = Number(document.getElementById("fromBShuttleInterval").value);
  settingsJSON.BtoARules.travel_time = Number(document.getElementById("fromBShuttleLength").value);

  localStorage.setItem("shuttleCalcSettingsJSON", JSON.stringify(settingsJSON));
  populatePage();
  showToast("Saved", "Settings saved to local storage!");
}

// Load calendar from local storage
function loadSettings() {
  var settingsData;
  try {
    console.log(localStorage.getItem("shuttleCalcSettingsJSON"));
    settingsData = JSON.parse(localStorage.getItem("shuttleCalcSettingsJSON"));
    console.log(settingsData);
    if (settingsData == "") throw new Error();
    showToast("Loaded", "Settings loaded from local storage!");
  } catch (error) {
    settingsData = {
      AName: "Apartment",
      BName: "School",
      AtoBRules: {
        start: "07:00",
        end: "20:00",
        interval: 30,
        travel_time: 20,
      },
      BtoARules: {
        start: "07:20",
        end: "19:50",
        interval: 30,
        travel_time: 10,
      },
    }
    showToast("Failed Loading", "No saved settings data found, loading defaults.");
  }

  const AtoBRules = new ShuttleRules(timeFromString(settingsData.AtoBRules.start), timeFromString(settingsData.AtoBRules.end), settingsData.AtoBRules.interval, settingsData.AtoBRules.travel_time);
  const BtoARules = new ShuttleRules(timeFromString(settingsData.BtoARules.start), timeFromString(settingsData.BtoARules.end), settingsData.BtoARules.interval, settingsData.BtoARules.travel_time);

  settings = new Settings(settingsData.AName, settingsData.BName, AtoBRules, BtoARules);
  populateSettings();
  populatePage();
}
loadSettings();

function populateSettings() {
  document.getElementById("AShuttleName").value = settings.AName;
  document.getElementById("BShuttleName").value = settings.BName;

  document.getElementById("fromAShuttleStart").value = settings.AtoBRules.start.toString();
  document.getElementById("fromAShuttleEnd").value = settings.AtoBRules.end.toString();
  document.getElementById("fromAShuttleInterval").value = settings.AtoBRules.interval;
  document.getElementById("fromAShuttleLength").value = settings.AtoBRules.travel_time;

  document.getElementById("fromBShuttleStart").value = settings.BtoARules.start.toString();
  document.getElementById("fromBShuttleEnd").value = settings.BtoARules.end.toString();
  document.getElementById("fromBShuttleInterval").value = settings.BtoARules.interval;
  document.getElementById("fromBShuttleLength").value = settings.BtoARules.travel_time;
}

function populatePage() {
  document.getElementById("StBoption").innerHTML = `Shuttle to ${settings.BName}`;
  document.getElementById("StAoption").innerHTML = `Next Shuttle to ${settings.AName}`;
  document.getElementById("StAtBoption").innerHTML = `${settings.BName} to ${settings.AName} and Back`;
  
  document.getElementById("leaveTimeLabel").innerHTML = `Earliest Time to Leave From ${settings.BName}`;
  document.getElementById("returnTimeLabel").innerHTML = `Earliest Time to Return to ${settings.BName}`;  
}

// Handle shuttle rules popup
document.querySelector('.card-header').addEventListener('click', function() {
    document.querySelector('.expanding-card').classList.toggle('show');
});

// Handle form changes on selector change
function handleFormSelector(selectorValue) {
    const selectedCalculation = selectorValue;
    document.querySelectorAll("#shuttleForm > div").forEach((section) => {
      section.classList.add("d-none");
    });

    document.querySelectorAll("#shuttleForm input").forEach((input) => {
      input.removeAttribute("required");
      input.value = "";
    });

    document.querySelectorAll("." + selectedCalculation).forEach((section) => {
      section.classList.remove("d-none");
    });

    document.querySelectorAll("." + selectedCalculation + " input:not(.skipRequired)").forEach((input) => {
      input.setAttribute("required", "");
    });
}
handleFormSelector("calcA");

document
  .getElementById("calculationType")
  .addEventListener("change", function (event) {
    handleFormSelector(event.target.value);
  });

// On submit handle
document
  .getElementById("shuttleForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const calculationType = document.getElementById("calculationType").value;
    let resultText = "";

    if (calculationType === "calcA") {
      const classTime = document.getElementById("classTime").value;
      const walkingTime =
        document.getElementById("walkingTime").value == ""
          ? 0
          : parseInt(document.getElementById("walkingTime").value);

      const shuttleTime = calculateShuttleOneWay(
        classTime,
        walkingTime,
        settings.AtoBRules,
        false
      );

      resultText =
        "You should catch the shuttle leaving at " +
        shuttleTime.departure.toString();
      +" to arrive at time.";
    } else if (calculationType === "calcB") {
      const shuttleTimeString = document.getElementById("shuttleTime").value;
      const shuttleTime = calculateShuttleOneWay(
        shuttleTimeString,
        0,
        settings.BtoARules,
        true
      );

      resultText =
        "The next shuttle leaves at " +
        shuttleTime.departure.toString() +
        ".\n It arrives back at " +
        shuttleTime.arrival.toString() +
        ".";
    } else if (calculationType === "calcC") {
      const leaveTime = document.getElementById("leaveTime").value;
      const returnTime = document.getElementById("returnTime").value;
      const result = calculateShuttleToApartmentAndBack(leaveTime, returnTime);
      resultText =
        "You should leave school at " +
        result.leaveShuttle.departure.toString() +
        " and catch the shuttle back at " +
        result.returnShuttle.departure.toString() +
        ".<br>Time spent at apartment: " +
        result.timeSpent.toString();
      console.log(resultText);
    }

    document.getElementById("result").innerHTML = resultText;
    document.getElementById("result").classList.remove("d-none");
  });

/**
 * Function to find the next time a shuttle arrives
 * @param {Time} time The time to check against
 * @param {Object} shuttleRules JSON object of the rules of the shuttle
 * @param {Boolean} shuttleArriveBeforeTime True = Find Shuttle Arriving By time, False = Find Next Shuttle After time
 * @returns {Object} Two Time Values ["departure"]: when it leaves ["arrival"]: when the shuttle arrives
 */
function getNextShuttleTime(time, shuttleRules, shuttleArriveBeforeTime) {
  const timeToArrive = new Time(time.hours, time.minutes);
  // if (needArriveByTime) {
  //   timeToArrive.addTime(0, -shuttleRules.interval);
  // }

  if (time.compare(shuttleRules.start) < 0) {
    return "No shuttles available, too early";
  } else if (time.compare(shuttleRules.end) > 0) {
    return "No shuttles available, too late";
  }

  timeToArrive.addTime(-shuttleRules.start.hours, -shuttleRules.start.minutes);

  // If finding shuttle before time
  if (!shuttleArriveBeforeTime)
    timeToArrive.addTime(0, -shuttleRules.travel_time);

  const totalDifferenceInMinutes =
    timeToArrive.hours * 60 + timeToArrive.minutes;

  let intervalsPassed = parseInt(
    totalDifferenceInMinutes / shuttleRules.interval
  );
  if (shuttleArriveBeforeTime) intervalsPassed++;
  console.log(`Number of shuttle intervals passed ${intervalsPassed}`);

  const shuttleTime = new Time(
    shuttleRules.start.hours,
    shuttleRules.start.minutes
  );
  shuttleTime.addTime(0, intervalsPassed * shuttleRules.interval);

  const arrivalTime = new Time(shuttleTime.hours, shuttleTime.minutes);
  arrivalTime.addTime(0, shuttleRules.travel_time);

  return {
    departure: shuttleTime,
    arrival: arrivalTime,
  };
}

/**
 *
 * @param {String} timeString Time to arrive by as a string
 * @param {int} errorTime Minutes earlier for the shuttle to arrive by
 * @param {Object} shuttleRules JSON object of the rules of the shuttle
 * @param {Boolean} shuttleArriveBeforeTime True = Find Shuttle Arriving By time, False = Find Next Shuttle After time
 * @returns {Object} Two Time Values ["departure"]: when it leaves ["arrival"]: when the shuttle arrives
 */
function calculateShuttleOneWay(
  timeString,
  errorTime,
  shuttleRules,
  shuttleArriveBeforeTime
) {
  if (errorTime < 0) return "Walking time can't be negative";

  const [hours, minutes] = timeString.split(":").map(Number);
  const time = new Time(hours, minutes);

  // Roll back time by walking time
  time.addTime(0, -errorTime);

  const shuttleTime = getNextShuttleTime(
    time,
    shuttleRules,
    shuttleArriveBeforeTime
  );
  return shuttleTime;
}

/**
 * Calculate time at the apartment when
 * @param {String} leaveTimeString String representing time to leave school by
 * @param {String} returnTimeString String representing time to return by
 * @returns {Object}
 */
function calculateShuttleToApartmentAndBack(leaveTimeString, returnTimeString) {
  const [leaveHours, leaveMinutes] = leaveTimeString.split(":").map(Number);
  const [returnHours, returnMinutes] = returnTimeString.split(":").map(Number);

  const leaveTime = new Time(leaveHours, leaveMinutes);
  const returnTime = new Time(returnHours, returnMinutes);

  let leaveShuttle = getNextShuttleTime(leaveTime, settings.BtoARules, true);
  let returnShuttle = getNextShuttleTime(returnTime, settings.AtoBRules, false);

  const timeSpent =
    new Date(`2000-01-01T${returnShuttle.departure.toString()}Z`) -
    new Date(`2000-01-01T${leaveShuttle.arrival.toString()}Z`);
  const hoursSpent = Math.floor(timeSpent / (1000 * 60 * 60));
  const minutesSpent = Math.floor((timeSpent % (1000 * 60 * 60)) / (1000 * 60));

  return {
    leaveShuttle: leaveShuttle,
    returnShuttle: returnShuttle,
    timeSpent: new Time(hoursSpent, minutesSpent),
  };
}
