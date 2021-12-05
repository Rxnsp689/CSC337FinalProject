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
const User = require("./server/schemas/User");
const Room = require("./server/schemas/Room");
const Canvas = require("./server/schemas/Canvas");
const crypto = require('crypto');
//const users = require("./server/routes/Rooms");
//const rooms = require("./server/routes/Rooms");

// Tell the express app to pare any body type and to use a cookie parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/app/*', authenticate);
app.use(express.static('public_html'));
app.get('/', (req, res) => { res.redirect('/account/index.html'); });

const port = 3000;
http.listen(port, () => {
  console.log('server has started');
});

// Session code
TIMEOUT = 120000 // 2 minutes
var sessions = {};

function filterSessions() {
  let now = Date.now();
  for (e in sessions) {
    if (sessions[e].time < (now - TIMEOUT)) {
      delete sessions[e];
    }
  }
}


setInterval(filterSessions,2000);
function putSession(username, sessionKey){
  if (username in sessions) {
    sessions[username] = {'key': sessionKey, 'time': Date.now()};
    return sessionKey;
  } else {
    let sessionKey = Math.floor(Math.random() * 1000);
    sessions[username] = {'key': sessionKey, 'time': Date.now()};
    return sessionKey;
  }
}

function isValidSession(username, sessionKey) {
  if (username in sessions && sessions[username].key == sessionKey) {
    return true;
  }
  return false;
}

// hashing code
function getHash(password, salt) {
  var cryptoHash = crypto.createHash('sha512');
  var toHash = password + salt;
  var hash = cryptoHash.update(toHash, 'utf-8').digest('hex');
  return hash;

}

function isPasswordCorrect(account, password) {
  var hash = getHash(password, account.salt);
  return account.hash == hash;
}

function authenticate(req, res, next) {
  console.log("IN authenticate");
  var c = req.cookies;
  if(Object.keys(req.cookies).length > 0){
    let u = req.cookies.login.username;
    let key = req.cookies.login.key;
    if (isValidSession(u, key)) {
      putSession(u, key);
      res.cookie("login", {username: u, key:key}, {maxAge: TIMEOUT});
      next();
    } else {
        console.log("Redirect");
        res.redirect("/account/index.html");
    }
  } else {
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
    //requestData = JSON.parse(req.body.data);
    // need to get user's id (currently using test1)
    var c = req.cookies;
    console.log(c);
    var u;
    if(c && c.login){
        u = c.login.username;
        console.log("username: "+ u);
    }
    User.findOne({username:u}).exec((err,results) => {
        if(err){return res.end("ERROR");};
        var canvas1 = new Canvas({user_id: results._id, data_url:""});
        canvas1.save((err)=>{
            if(err) console.log('Failed to create canvas');
            console.log("Saved canvas");
            //res.end("Saved canvas successfully");
        });
        var room1 = new Room({host_id: results._id, room_token: generateRoomID(15), canvas_id: canvas1._id});
        room1.save((err)=>{
            if(err) console.log('PROBLEM');
            console.log("SAVED");
            //res.end("SAVED");
        });
        res.end(JSON.stringify(room1));
    });

});


app.get('/account/create/:username/:password', (req,res) => {
    console.log("server create user");
    User.find({username : req.params.username}).exec(function(error, results) {
        if (!error && results.length == 0) {
            var salt = Math.floor(Math.random() * 1000000000000);
            var hash = getHash(req.params.password, salt);
            var user1 = new User({
                'username': req.params.username,
                'salt':salt,
                'hash':hash
            });
            user1.save((err)=>{
                if(err) console.log('PROBLEM');
                res.end("Account created");
            });
        } else{
            res.end("Username already taken");
        }
    });
});

app.get('/account/login/:username/:password', (req, res) => {
  User.find({username: req.params.username}).exec(function(err,results){
    if(err){
      return res.end("Error login");
    } else if(results.length==1){
        var password = req.params.password;
        var salt = results[0].salt;
        var correct = isPasswordCorrect(results[0], password);
        if(correct){
            var sessionKey = putSession(req.params.username);
            res.cookie("login", {username: req.params.username, key:sessionKey}, {maxAge: TIMEOUT});
            res.end('LOGIN');
        } else{
            res.end('There was an issue logging in please try again');
        }
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
