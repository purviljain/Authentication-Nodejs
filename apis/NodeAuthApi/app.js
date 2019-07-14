const express = require('express');
const jwt = require('jsonwebtoken');

var app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the Api'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      RES.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...'
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  //Mock user
  const user = {
    id:1,
    username: 'Purvil',
    email: 'purvil@gmail.com'
  }

  jwt.sign({user: user
            //es6
            //{user}
  }, 'secretkey', { expiresIn: '30s'}, (err, token) => {
    res.json({
      token: token
      //es6-
      //token
    });
  });
});

//format
//authorization: bearer <token>

//Verify token
function verifyToken(req, res,next){
  //get auth header value
  const bearerHeader = req.headers['authorization'];

  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log('Server started on port 5000'));
