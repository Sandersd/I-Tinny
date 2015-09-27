Events = new Mongo.Collection("events");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Meteor.startup(function(){
    BlazeLayout.render('main', { content: "first" });

  });

  Template.test_page.events({
    "click .new-assessment": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      //replace info thing with quiz
      $('.info-container').addClass('is-hidden');
      $('.white-bg-cover').removeClass('is-hidden');

      HTTP.call('POST', 'https://api-sandbox.traitify.com/v1/assessments', {headers: { "Content-Type": "application/json", "Authorization": "Basic vuton8j6qv0o3mn0kqpkpbdmo6:x"}, data: {deck_id: 'core'} }, function(error, response){

        // Get new assessment ID
        Session.set("assessment_id", JSON.parse(response.content).id)

        Traitify.setPublicKey("l6uv37ui1fir0cf7eb519f70le");
        Traitify.setHost("https://api-sandbox.traitify.com");
        Traitify.setVersion("v1");
        Traitify.setEnvironment("development"); // this is the *magic*, auto-answers all but 4 slides
        var traitify = Traitify.ui.load(Session.get("assessment_id"), ".assessment",{slideDeck: {showResults: false}})
        traitify.slideDeck.onFinished(function(){
          BlazeLayout.render('main', { content: "second" });
          HTTP.call('GET', 'https://api-sandbox.traitify.com/v1/assessments/' + Session.get("assessment_id") + '?data=types', {headers: { "Content-Type": "application/json", "Authorization": "Basic vuton8j6qv0o3mn0kqpkpbdmo6:x"} }, function(error, response){
            /*console.log(response.data.personality_types[0]["score"])
            console.log(response.data.personality_types[2]["personality_type"]["name"])
            console.log(response.data.personality_types[5]["personality_type"]["name"])
            */
            Session.set('person', response.data.personality_types);
          })
        })
      })
    }
  });

  Template.results.events({
    "click #places": function(event, template){
       var personality = Session.get('person');
       var ambitious = personality[0]["score"];
       var mellow = personality[2]["score"];
       var social = personality[5]["score"];
       console.log(ambitious + ', ' + mellow + ', ' + social);
       var mood = '?mood=' + ambitious + '&mood=' + mellow + '&mood=' +social;

       mood += "&Category=camping&State=CA&City=sunnyvale";
       HTTP.call( 'GET', 'http://localhost:5000/itinerary' + mood, function( error, response ) {
         var newEvents = JSON.parse(response.content);
         console.log(newEvents);
         console.log(newEvents.businesses.length);

         for(var i = 0; i < newEvents.businesses.length; i++) {
           var name = newEvents.businesses[i].name;
           var address = newEvents.businesses[i].address;
           var state = newEvents.businesses[i].state;
           var zip = newEvents.businesses[i].zip;
           var city = newEvents.businesses[i].city;

           Events.insert({name: name, address: address, city: city, state: state, zip: zip, category: "Social"});
         }



       });
    }
  });


}
