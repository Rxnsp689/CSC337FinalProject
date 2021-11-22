const express = require("express");
const router = express.Router();
const User = require("../../schemas/User");
var socket = io();
router.get('/currUser', (req,res) => {
    var c = req.cookies;
    var u;
    if(c && c.login){
        u = c.login.username;
    }
    User.findOne({username:u}).exec((err,results) => {
        if(err){return res.end("ERROR");};
        p = results.password
        userObj = {'username':u, 'password':p};
        res.end(JSON.stringify(userObj));
    });
});

router.post('/create', (req,res) => {
    requestData = JSON.parse(req.body.data);
    var user1 = new User({username: requestData.username, password:requestData.password});
    user1.save((err)=>{
        if(err) console.log('PROBLEM');
        socket.emit('createUser',requestData);
        res.end("SAVED");
    });
});

/*
no hashing of passwords
*/
router.get('/login/:username/:password', (req, res) => {
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

module.exports = router;
