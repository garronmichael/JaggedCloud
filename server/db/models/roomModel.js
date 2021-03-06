var db = require('../config.js');
var mongoose = require('mongoose');


// SCHEMAS: each schema maps to a 'collection' in MongoDB (analogous to SQL table) and defines the shape of the 'documents' within that colletion (documents are analogous to a row in a SQL table)
var roomSchema = new mongoose.Schema({

  is_open: {
    type: Boolean,
    default: false,
  },

  date_created: {
    type: Date,
    default: Date.now
  },

  start_time: Date,
  created_by: String, // githubId
  canvas: String,
  text: [String],
  notes: String
});


// MODELS: a model is a class with which we construct documents (rows in a table)
module.exports = mongoose.model('Room', roomSchema);