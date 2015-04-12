
// require in our dependencies 
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');

module.exports = function(app, express) {

  // http request logger for development 
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // serve fav icon and static files 
  app.use(favicon(__dirname + '/../client/lib/favicon.ico'));
  app.use(express.static(__dirname + '/../client'));

  /* Sessions
  *  Sessions allow a user to have a persistent login period if they navigate away from the page
  *  Express provides this functionality with the express-session module 
  *  Passport piggy-backs off this object and this is why passport.initialize and passport.session must be invoked after app.use(session())
  *  The options object we pass into the session sets the name of the session object, a required secret string and a store
  *  The store here references our mongo database where we will save our sessions
  *  This is important because without this store all our sessions are lost if the server goes down
  */
  app.use( session({ key: 'session', secret: 'SUPER SECRET', store: new MongoStore({ url: process.env.MONGOLAB_URI || 'mongodb://localhost/hackbox'}) }) );
  app.use(passport.initialize());
  app.use(passport.session());

  // create routers
  var authRouter = express.Router();
  var userRouter = express.Router();
  var roomRouter = express.Router();
  
  /* Create paths for authentication, user and room data
  *  /auth/path/to/whatever will always use the authRouter
  */
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/room', roomRouter);
  
  // require the needed route files and pass in the router
  require('./auth/authRoutes.js')(authRouter);
  require('./users/userRoutes.js')(userRouter);
  require('./rooms/roomRoutes.js')(roomRouter);
};