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
const Canvas = require("./server/schemas/Canvas");
//const users = require("./server/routes/Rooms");
//const rooms = require("./server/routes/Rooms");

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

function addSession(socketID,username){
  users[socketID] = username
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
app.get('/currUser', (req,res) => {
    var c = req.cookies;
    var u;
    if(c && c.login){
        u = c.login.username;
    }
    User.findOne({username:u}).exec((err,results) => {
        if(err){return res.end("ERROR");};
        /*p = results.password
        userObj = {'username':u, 'password':p};
        res.end(JSON.stringify(userObj));*/
        res.end(JSON.stringify(results));
    });
});

app.post("/createRoom", (req,res) => {
    console.log("in create room");
    var c = req.cookies;
    console.log(c);
    var u;
    if(c && c.login){
        u = c.login.username;
        console.log("username: "+ u);
    }
    User.findOne({username:u}).exec((err,results) => {
        if(err){return res.end("ERROR");};
        var room1 = new Room({host_id: results._id, room_token: generateRoomID(15)});

        room1.save((err)=>{
            if(err) console.log('PROBLEM');
            console.log("SAVED");
            //res.end("SAVED");
        });
        res.end(JSON.stringify(room1));
    });

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
      //addSession(req.params.username);
      res.cookie("login",{username: req.params.username});
      console.log("Added cookie");
      //res.cookie("login",{username: req.params.username}, {maxAge: 120000});
      res.end("LOGIN");
    } else{
      res.end("incorrect number of results");
    }
  });
});

app.get("/room/:token", (req,res) => {
    console.log("in server side room");
    //requestData = JSON.parse(req.body.data);
    //console.log("room_token: "+requestData.room_token);
    console.log("token: " + req.params.token);
    Room.findOne({room_token:req.params.token}).then(room => {
        if(room){
            res.end(JSON.stringify(room));
        } else{
            res.end("Room not found");
        }
    });
});

// need get user_id through cookies
app.post('/createCanvas', (req,res) => {
    requestData = JSON.parse(req.body.data);
    var canvas1 = new Canvas({user_id: requestData.user_id, data_url:requestData.data_url});
    canvas1.save((err)=>{
        if(err) console.log('Failed to create canvas');
        res.end("Saved canvas successfully");
    });
});

// get all canvases for a user
app.get("/getCanvas/:userid",(req,res)=>{
    Canvas.find({user_id:req.params.userid}).exec((err,results) => {
        if(err){return res.end("ERROR");};
        res.end(JSON.stringify(results));
    });
});
/*
authenticate here?
*/
// redirection using the socket seems to be needed
// since just changing window location(from login) disconnects the socket
io.on("connection",(socket)=>{
    socket.on("login",(userLogin)=>{
        var u = userLogin.username;
        var p = userLogin.password;
        addSession(socket.id,u);
        console.log("IN SOCKET LOGIN");
        console.log(users);
    });
    socket.on("logout", ()=>{
        console.log("IN SOCKET LOGOUT");
        console.log(socket.id);
        console.log(users);
        if(socket.id in users){
            console.log(users[socket.id] + " has logged out");
            delete users[socket.id];
            console.log(users);
        }
    });
    socket.on("disconnect", ()=>{
        console.log("IN SOCKET DISCONNECT");
        console.log(socket.id);
        console.log(users);
        if(socket.id in users){
            console.log(users[socket.id] + " has logged out");
            delete users[socket.id];
            console.log(users);
        }
    });
});
