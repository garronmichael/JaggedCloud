var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');

module.exports = function(app, express) {

  // create routers
  var authRouter = express.Router();
  var userRouter = express.Router();
  var roomRouter = express.Router();

  // http request logger for development 
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  // initialize passport and sessions
  app.use(passport.initialize());

  // serve html and css 
  console.log(__dirname + '/../client/lib/favicon.ico')
  app.use(favicon(__dirname + '/../client/lib/favicon.ico'));
  app.use(express.static(__dirname + '/../client'));

  // required for passport sessions
  app.use(bodyParser());
  app.use( session({ key: 'session', secret: 'SUPER SECRET', store: new MongoStore({ url: process.env.MONGO_URI || 'mongodb://localhost/hackbox'}) }) );
  app.use(passport.initialize());
  app.use(passport.session());
  
  // create paths for authentication, and user and room data storage
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/room', roomRouter);
  
  // require the needed route files and pass in the router
  require('./auth/authRoutes.js')(authRouter);
  require('./users/userRoutes.js')(userRouter);
  require('./rooms/roomRoutes.js')(roomRouter);
};