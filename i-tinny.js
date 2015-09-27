if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Meteor.startup(function(){
    BlazeLayout.render('main', { content: "first" });
  })

  Template.calendar.events({
    "submit .bookFlight": function (event) {
      event.preventDefault();
      console.log("TESTING");
      // call a method here;
      // Meteor.call("oAuth");

      Meteor.call("bookFlight", function(error, response){
        Session.set("arrivalCity", response);
        console.log(Session.get("arrivalCity"));
      });

      console.log("**************");
    }
  });

  Template.calendar.helpers({
    arrivalCity: function(){
      return Session.get("arrivalCity");
    }
  });

  Template.test_page.events({
    "click .new-assessment": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

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
            console.log(response.data.personality_types[0]["score"])
            console.log(response.data.personality_types[2]["personality_type"]["name"])
            console.log(response.data.personality_types[5]["personality_type"]["name"])
          })
        })
      })
}
});

}


if (Meteor.isServer) {
  Meteor.methods({
    oAuth: function(){
      HTTP.call('POST', "https://api.test.sabre.com/v2/auth/token", {headers: [{"Content-Type": "application/x-www-form-urlencoded", "Authorization": "Basic VmpFNmNEazViRzlpYVhsbGJtdzBOVzFvWWpwRVJWWkRSVTVVUlZJNlJWaFU6UTNSaGJUTlNXVE09"}]}, function(error, response){
        console.log(error);
        console.log("*************");
        console.log(response);
      })
    },

    // VjE6cDk5bG9iaXllbmw0NW1oYjpERVZDRU5URVI6RVhU
    // Q3RhbTNSWTM=


    bookFlight: function(){
      Meteor.http.get("https://api.test.sabre.com/v2/shop/flights/fares?origin=SFO&lengthofstay=3&location=US&theme=GAMBLING&pointofsalecountry=US&topdestinations=2", {headers: {"Authorization": "Bearer T1RLAQJ2NvikXFGJwHzs4LBwCUySjJVsjhDNHgXTt0IqwRS23JzVG/F3AACgqltkCdUvNVLjlcuodlKEJJi5oRqitfdAkCiIfBKH/og6sI+ZHBIPIpn3ZdudKT+IyMcU5wH0kO0cK5Q8RorgRZixTvivCbiNTfx2Wc3fZ1qxGV+oROA9EDx/2CbQIV4aX9AsmozRIVCELiQ5AhOg2Uh4tqt4NOQrvaMMwV6Go+JK8VVcXIW4JfI38eQbCPl7LYK7WddmclJQ9uNrtnEMFw**", "X-Originating-Ip": "64.245.0.68"}}, function(error, response){
        reactiveCity = response.data.FareInfo[0].DestinationLocation;
        console.log(reactiveCity);
        return reactiveCity;
      })
    }
  })
}