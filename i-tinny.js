if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Template.body.events({
    "click .new-assessment": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      HTTP.call('POST', 'https://api-sandbox.traitify.com/v1/assessments', {headers: { "Content-Type": "application/json", "Authorization": "Basic vuton8j6qv0o3mn0kqpkpbdmo6:x"}, data: {deck_id: 'career-deck'} }, function(error, response){
      
        // Get new Assessment ID         
        var assessment_id = JSON.parse(response.content).id        
      })
    }
  });
}