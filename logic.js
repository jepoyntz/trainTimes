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
  
     var  nextArrival= 0;//$("#nextArrival-input").val();
     var minAway = 0; //("#minAwaymi-input")
     var  timeA = 0;//("#timeA-input")
     var timeB =  0;//("#timeB-input")

      var newTrain = {
        name: name,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
        
      };

     dataRef.ref().push(newTrain);
     $("#name-input").val("")
     $("#destination-input").val("")
     $("#firstTrainTime-input").val("")
     $("#frequency-input").val("")
     $("#name-input").focus()

   })
    //to retrieve data from firebas
    function retrieveData(){
        // mostly standard second line retrieving data
        dataRef.ref().on("value", function(snapshot){
            //var becomes what current value in firebase
            //called for every single child in tree
            //ex .name is a key name, and value of staement is that keys value
            var allChildKeys = Object.keys(snapshot.val()); // allChildKeys contains all random db keys (is array)
            //clear out table data so we can reinsert with updated times
            //by not giving .html a value we clear it out
            $("#trainTime").html("");
            for (var i=0; i < allChildKeys.length; i++){
              //thisKey is the new train info input
              var thisKey = allChildKeys[i];
              var name = snapshot.val()[thisKey].name
              var destination = snapshot.val()[thisKey].destination;
              var  firstTrainTime = snapshot.val()[thisKey].firstTrainTime;
              var  frequency = snapshot.val()[thisKey].frequency
            

               // First Time (pushed back 1 year to make sure it comes before current time)
              var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
              console.log(firstTimeConverted);

              var addedTime = 0;

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
              var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
              //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

               //if train is in future add time between to the minutes away
               //sets next train time equal to first train time
              if (moment(moment(), "hh:mm").diff(moment(firstTrainTime, 'hh:mm')) < 0) {
                addedTime = (moment(moment(), "hh:mm").diff(moment(firstTrainTime, 'hh:mm')) * -1) / 1000 / 60;
                nextTrain = moment(firstTrainTime, 'hh:mm').format('hh:mm');
                tMinutesTillTrain += Math.floor(addedTime);
                console.log(addedTime, nextTrain);
              }

        //making a cell for new items we want to display
              var nameCell = $("<td></td>").text(name);
              var destinationCell = $("<td></td>").text(destination);
              var  firstTrainTimeCell = $("<td></td>").text(nextTrain);
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
          }
        })

    }