// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the trains database.
// 4. Create a way to calculate next train
// 5. Create a way to calculate how far away next train is
//    
 

 
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDuav1aY3lF1PvL9bPQ_MqyhUjyGH3oij0",
    authDomain: "trainscheduler-bbefe.firebaseapp.com",
    databaseURL: "https://trainscheduler-bbefe.firebaseio.com",
    projectId: "trainscheduler-bbefe",
    storageBucket: "",
    messagingSenderId: "216034008048"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Button for adding trains
  $("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  // var empStart = moment($("#start-input").val().trim(), "DD/MM/YY").format("X");
  var frequency = $("#frequency").val().trim();
  var firstTrain = $("#firstTrain").val().trim();
  // console.log("train " + trainName);

  // create local temporary object for holding train database
  var newTrain = {
  	tempName: trainName,
  	tempDestination: destination,
  	tempFrequency: frequency,
  	tempFirstTrain: firstTrain
  };
  // upload train data to firebase
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.tempName);
  console.log(newTrain.tempDestination);
  console.log(newTrain.tempFrequency);
  console.log(newTrain.tempFirstTrain);

  // Clear all of the text-boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#firstTrain").val("");
});

// 3. Create Firebase event for adding new train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log("note child " + childSnapshot.val());

  // Store everything into a variable.
  var train = childSnapshot.val().tempName;
  var destination = childSnapshot.val().tempDestination;
  var frequency = childSnapshot.val().tempFrequency;
  var firstTrain = childSnapshot.val().tempFirstTrain;

  // // Train Info
  console.log(train);
  console.log(destination);
  console.log(frequency);
  console.log(firstTrain);
 
   
 	// Calculations for next train and minutes away
  	 
    var firstTime = firstTrain;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  
      // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

     // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var displayNextTrain = moment(nextTrain).format("hh:mm");

  // // Add each train's data into the table
  $("#schedule-table > tbody").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + displayNextTrain + "</td><td>" + tMinutesTillTrain +"</td><td>");  
});

 