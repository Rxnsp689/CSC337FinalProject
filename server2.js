const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser')
const cookieParser = require('cookie-parser');
// Initialize the express application
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const User = require("server/schemas/User");

// Tell the express app to pare any body type and to use a cookie parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(cookieParser());

//app.use('/app/*', authenticate);
app.use(express.static('public_html'));
app.get('/', (req, res) => { res.redirect('/app/home.html'); });

const port = 3000;
http.listen(port, () => {
  console.log('server has started');
});

var users = {};

function addSession(username,socketID){
  users[socketID] = socketID
}

function doesUserHaveSession(username){
    for(socketid in users){
        if(users[socketid] == username){
            return true
        }
    }
    return false;
}

function authenticate(req, res, next) {
  console.log("IN authenticate");
  var c = req.cookies;
  if(c && c.login){
    var username = c.login.username;
    if(doesUserHaveSession(username)){
      console.log("Has Session");
      //addSession(username);
      next();
    } else{
      console.log("Redirect");
      res.redirect("/account/index.html");
    }
  } else{
    console.log("Redirect");
    res.redirect("/account/index.html");
  }
}

const db  = mongoose.connection;
const mongoDBURL = 'mongodb://127.0.0.1/draw';
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


/*
authenticate here?
*/
/*
io.on("connection",(socket)=>{
    socket.on("login",(userLogin)=>{
        var u = userLogin.username;
        var p = userLogin.password;

    });
    socket.on("disconnect", function(){
        if(socket.id in users){
            console.log(users[socket.id] + " has disconnected");
            delete users[socket.id];
        }
    });
});*/
