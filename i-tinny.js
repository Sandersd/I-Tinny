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
            console.log(response.data.personality_types)
            console.log(response.data.personality_types.score)
          })
        })
      })
    }
  });
}
