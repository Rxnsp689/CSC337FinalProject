/*
cannot seem to move out server routes to other folders? any alternative?
*/
const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser')
const cookieParser = require('cookie-parser');
// Initialize the express application
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const User = require("./server/schemas/User");
const Room = require("./server/schemas/Room");
//const users = require("./server/routes/Rooms");
const rooms = require("./server/routes/Rooms");

// Tell the express app to pare any body type and to use a cookie parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(cookieParser());

//app.use("/rooms",rooms);
//app.use('/app/*', authenticate);
app.use(express.static('public_html'));
app.get('/', (req, res) => { res.redirect('/account/index.html'); });

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

function generateRoomID(tokenLength){
    var possibleChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lenChars = possibleChars.length;
    var id = "";
    for(var i = 0; i<tokenLength;i++){
        id+=possibleChars.charAt(Math.floor(Math.random() * lenChars));
    }
    return id;
}

app.post("/createRoom", (req,res) => {
    console.log("in create room");
    //requestData = JSON.parse(req.body.data);
    // need to get user's id (currently using test1)
    var room1 = new Room({host_id: "619c4e9f139ae6bd7df25b6a", room_token: generateRoomID(15)});

    room1.save((err)=>{
        if(err) console.log('PROBLEM');
        console.log("SAVED");
        //res.end("SAVED");
    });
    res.end(JSON.stringify(room1));
});

app.get('/account/create/:username/:password', (req,res) => {
    //requestData = JSON.parse(req.body.data);
    //var user1 = new User({username: requestData.username, password:requestData.password});
    console.log("server create user");
    var user1 = new User({username: req.params.username, password:req.params.password});
    user1.save((err)=>{
        if(err) console.log('PROBLEM');
        //socket.emit('createUser',requestData);
        res.end("SAVED");
    });
});

app.get('/account/login/:username/:password', (req, res) => {
  User.find({username: req.params.username, password:req.params.password}).exec(function(err,results){
    if(err){
      return res.end("Error login");
    } else if(results.length==1){
      addSession(req.params.username);
      res.cookie("login",{username: req.params.username}, {maxAge: 120000});
      res.end("LOGIN");
    } else{
      res.end("incorrect number of results");
    }
  });
});
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
