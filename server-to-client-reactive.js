notifications = new Meteor.Stream('server-notifications');

if (Meteor.isClient) {
  //create a client only collection
  notificationCollection = new Meteor.Collection(null);

  //listen to the stream and add to the collection
  serverEvents.on('message', function(event) {
    var message = event.memo.message;
    var time = event.memo.time;
    notificationCollection.insert({
      message: message,
      time: time
    });
    console.log('received message');
  });

  //render template with the collection
  Template.bodyTem.helpers({
    'messages': function() {
      return notificationCollection.find();
    },

    'dateString': function() {
      return new Date(this.time).toString();
    }
  });

  //simple clear message action
  Template.bodyTem.events({
    'click #clear-messages': function() {
      notificationCollection.remove({});
    }
  });
}

if (Meteor.isServer) {

  //notify clients with a message per every second
  setInterval(function() {
    serverEvents.triggerEvent("message", {message: 'Server Generated Message', time: Date.now()});
    console.log('sent message');
    console.log(Date.now().toString());
  }, 1000);
}
