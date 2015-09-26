if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Template.test_page.events({
    "click .new-assessment": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
      HTTP.call('POST', 'https://api-sandbox.traitify.com/v1/assessments', {headers: { "Content-Type": "application/json", "Authorization": "Basic vuton8j6qv0o3mn0kqpkpbdmo6:x"}, data: {deck_id: 'career-deck'} }, function(error, response){
      
        // Get new assessment ID         
        var assessment_id = JSON.parse(response.content).id

        Traitify.setPublicKey("l6uv37ui1fir0cf7eb519f70le");
        Traitify.setHost("https://api-sandbox.traitify.com");
        Traitify.setVersion("v1");
        var assessmentId = assessment_id;
        Traitify.ui.load(assessment_id, ".assessment")
        
      })
    }
  });
}