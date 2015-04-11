var Room = require('../db/models/roomModel');

var handleError = function(error) {
  console.log('the following error has occurred: ' + error);
};

// TODO: for all queries, confirm what I am expecting:  { roomID: Integer, canvas: String, textData: String }
// TODO: check syntax for reference to roomID

// instantiation pattern: var partyRoom = new Room() --> need to pass data into room upon instantiation?
module.exports.create = function(req, res) {
  console.log(req.body);
  var user = req.body.name;
  var startTime = req.body.time;
  var email = req.body.email;
  console.log(' in room creation');
  Room.create({email: email, user: user, start_time: startTime}, function(err, room){
    if (err) { handleError(err); }
    else if (room) {
      console.log(room + ': room successfully created');
      res.send(201, room);
    }      
  });
};

// update pattern: Model.update(conditions, doc, [options], [callback])
module.exports.save = function(req, res) {
  var roomID = req.data.roomId;
  var canvas = req.data.canvas;
  var text = req.data.textEditor;

  Room.findOneAndUpdate({'_id': roomID}, {canvas: canvas, text: text}, {upsert: true},
    function(err, room){
      if (err) { handleError(err); }
      else if (room) {
        console.log(room._id + ': room successfully updated');
        res.send(201, room);      
      }
    }
  );
};


module.exports.fetch = function(req, res) {
  console.log('In room controller fetch');
// first check if the room exists
// check if user made the room -- if yes, send back all data
// if no, send back only part of the data

  // var roomID = req.data.roomID;
  console.log('request:', req.params.id.slice(1));
  Room.findById(req.params.id, function(err, room){
    if (err) { 
      handleError(err); 
      res.send(404, 'no room data');
    }
    else if (room) {
      res.send(200, room);
    }
  });
};





