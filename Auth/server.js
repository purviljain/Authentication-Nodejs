var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var path        = require('path');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.sendFile('index.html',{ root: path.join(__dirname) });
});

app.get('/member', function(req, res) {
  res.send('Member');
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/signup', function(req, res) {
  console.log(req.body);
  if (!req.body.name || !req.body.password) {
  res.json({success: false, message: 'Please pass name and password.'});
  // console.log('working');
} else {
  var newUser = new User({
    name: req.body.name,
    password: req.body.password
  });
  // save the user
  newUser.save(function(err) {
    if (err) {
      return res.send({success: false, message: 'Username already exists.'});
    }
    res.json({success: true, message: 'Successful created new user.'});
  });
}
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
      const payload = {
        admin: user.admin
      };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: 14240 // expires in 24 hours
        });

        // return the information including token as JSON

        req.headers['x-access-token'] = token;
        req.headers.token = token;
        req.query.token = token;
        res.json({
          success: true,
          message: 'Enjoy your token! and you are now logged in!!',
          token: token
        });
        // res.redirect('/member');
      }

    }
    console.log(req.headers);
    console.log(req.query);
  });
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token =  req.query.token || req.headers['x-access-token'] || req.headers.token;
  console.log(req.body);
  console.log(token);
  console.log(req.headers);

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(402).send({
        success: false,
        message: 'No token provided.'
    });
  }
});


// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

apiRoutes.get('/auth/memberinfo', function(req, res){  
    res.send({message: 'Welcome to member area!'});
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

app.listen(port);
console.log('Server started at http://localhost:' + port);
