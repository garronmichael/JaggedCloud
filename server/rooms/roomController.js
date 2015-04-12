var Room = require('../db/models/roomModel');
var User = require('../db/models/userModel');

var handleError = function(error) {
  console.log('the following error has occurred: ' + error);
};



module.exports.create = function(req, res) {
  var startTime = req.body.time;
  var githubId = req.user;
  var email = req.body.email;
  var isOpen = Date.now() >= Date.parse(startTime);

  Room.create({ created_by: githubId, start_time: startTime, is_open: isOpen }, function(err, room){
    if (err) { handleError(err); }
    else if (room) {
      console.log('room successfully created!');

      User.findOneAndUpdate({github_id: githubId}, {$push: {rooms: [room._id]}}, {upsert: true}, function(err, user){
        if (err) { handleError(err); }
        else if (user) {
          console.log('successfully added new room to user!' + user);
        }
      });
      res.send(201, room);
    }      
  });
};


module.exports.save = function(req, res) {
  var notes = req.body.notes;
  var roomId = req.body.roomId;
  var canvas = req.body.canvas;
  var text = req.body.textEditor;

  Room.findOneAndUpdate({'_id': roomId}, {canvas: canvas, text: text, notes: notes}, {upsert: true},
    function(err, room){
      if (err) { handleError(err); }
      else if (room) {
        console.log('room successfully updated');
        res.send(201, room);      
      }
    }
  );
};


// TODO: complete candidateRoom object that contains only the data the the candidate should see
module.exports.fetchOne = function(req, res) {
  var roomId = req.params.id;
  var githubId = req.user;

  Room.findById(roomId, function(err, room){
    console.log('ROOM: ',room);
    // var canvas = room.canvas;
    // var text = room.text;
    // var candidateRoom = {
    //   canvas: canvas,
    //   text: text
    // }
    // console.log(candidateRoom);
    var isOpen = (Date.now() > Date.parse(room.start_time));

    if (err) { 
      handleError(err); 
      res.send(404, 'no room data');
    }
    else if (room && !isOpen) {
      res.send(404, 'room not available');
    }
    // if current user is room creator send back all room data, else send candidateRoom
    else if (room && isOpen) {
      if(githubId === room.creted_by) {
        res.send(200, room);
      }
      else {
        res.send(200, room); // change to candidateRoom once obj is complete
      }
    }
  });
};


// find user by id and retrieve rooms -- note: error handling is jank; pushes null to array if err
module.exports.fetchAll = function(req, res) {
  var githubId = req.user;
  var roomsArray = [];
  User.findOne({github_id: githubId}, 'rooms', function(err, user){
    if (err) { 
      handleError(err); 
      res.send(404, 'cannot find user by ID');
    }
    if(user) {
      var rooms = user.rooms;
      for (var i = 0; i < rooms.length; i++) {
        Room.findById(rooms[i], function(err, room){
          if (err) { 
            handleError(err); 
            roomsArray.push(null);
          }
          else {
            var roomData = {
              created_by: room.created_by,
              start_time: room.start_time,
              is_open: room.is_open,
              id: room._id
            }
            roomsArray.push(roomData);
          }
          if (roomsArray.length === rooms.length) {
            console.log('ROOMS ARRAY: ', roomsArray);
            res.send(202, roomsArray);
          }
        });
      }
    } else {
      res.send(304);
    }
  });
}

