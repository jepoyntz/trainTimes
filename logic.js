// here's the goal:

// when the page is loaded, display train times

// take in user input (as text)

// store that user input in your firebase database

// update the train-times table to reflect the firebase data



//~~~~~~~~~~~~~~~~


// first you need a working firebase connection

// you also need a reference to your FB database

// second, grab data stored in the FB database, and display it on the page

// then you need some method of grabbing user input when button is clicked

// after getting the user input, store this in the FB DB

// make sure you've got a firebase function that shows new data when children are added



//<script src="https://www.gstatic.com/firebasejs/3.7.4/firebase.js"></script>
//<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCum3tZ43DJAKLX8FOt6OFjnr-h5GKREIg",
    authDomain: "train-schedule-517a7.firebaseapp.com",
    databaseURL: "https://train-schedule-517a7.firebaseio.com",
    projectId: "train-schedule-517a7",
    storageBucket: "train-schedule-517a7.appspot.com",
    messagingSenderId: "33710923125"
  };
  firebase.initializeApp(config);

  var dataRef = firebase.database();
  //pretty standard , when html is loaded to call this function
  //loading 
  $(document).ready(function(){
    retrieveData()
  })  

  //form inputs
 // var trainName = "";
 // var destination = "";
 // var firstTrainTime = 0;     //military time
 // var frequency = 0;
 // var currentTime = 0;
  //calculations on Current Train Schedule
 // var nextArrival = 0; //(minAway + currentTime)
  //var minAway = 0;     //(frequency - timeB)
  
 // var timeA = 0;          //(currentTime - firstTrainTime)
 // var timeB =  0;          //(timeA % frequency)





// Capture Button Click
    $("#add-train").on("click", function(event) {


      // Don't refresh the page!
      event.preventDefault();  

     

      // am i putting my data in json form to send to firebase?
      // # or .?
     var name = $("#name-input").val().trim();
     var destination = $("#destination-input").val().trim();
     var  firstTrainTime = $("#firstTrainTime-input").val().trim();

     var  frequency = $("#frequency-input").val();

   

     // var currentTime = moment();//$("#currentTime-input").val();
     // console.log(currentTime)
     // var firstTimeFormat = moment(firstTrainTime, "hh:mm").subtract(1, "years");
     // console.log(firstTimeFormat)
     // var diffTime = moment().diff(moment(firstTimeFormat), "minutes");
     // console.log(diffTime);
     // var timeTillNext = diffTime % frequency;
     // console.log(timeTillNext)
     var  nextArrival= 0;//$("#nextArrival-input").val();
     var minAway = 0; //("#minAwaymi-input")
     var  timeA = 0;//("#timeA-input")
     var timeB =  0;//("#timeB-input")

      var newTrain = {
        name: name,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        currentTime: currentTime.format(),
        nextArrival: nextTrain.format(),
        minAway: tMinutesTillTrain, 
        
      };

     dataRef.ref().push(newTrain);

 })
    //to retrieve data from firebas
    function retrieveData(){
        // mostly standard second line retrieving data
        dataRef.ref().on("child_added", function(snapshot){
            //var becomes what current value in firebase
            //called for every single child in tree
            //ex .name is a key name, and value of staement is that keys value
            var name = snapshot.val().name
            var destination = snapshot.val().destination
            var  firstTrainTime = snapshot.val().firstTrainTime
            var  frequency = snapshot.val().frequency
          

             // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
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


      //making a cell for new items we want to display
            var nameCell = $("<td></td>").text(name);
            var destinationCell = $("<td></td>").text(destination);
            var  firstTrainTimeCell = $("<td></td>").text(firstTrainTime);
            var  frequencyCell = $("<td></td>").text(frequency);
            var minTillTrainCell = $("<td></td>").text(tMinutesTillTrain);
            //now they have to go somewhere
            var tableRow = $("<tr></tr>").html(nameCell)
            tableRow.append(destinationCell)
            tableRow.append(frequencyCell)
            tableRow.append(firstTrainTimeCell)
            tableRow.append(minTillTrainCell)

           
            //take row and put in table

            //everytime we add to database we append to tbody element in html
            $("#trainTime").append(tableRow)


            //now we do something with the data we just retrieved
            console.log(snapshot.val())
        })

    }