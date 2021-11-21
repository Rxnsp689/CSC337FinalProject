const mongoose = require('mongoose');
const express = require('express');
const parser = require('body-parser')
const cookieParser = require('cookie-parser');
// Initialize the express application
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);
const User = require("../../schemas/User");

// Tell the express app to pare any body type and to use a cookie parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(cookieParser());

const port = 3000;
http.listen(port, () => {
  console.log('server has started');
});

/*
authenticate here?
*/
io.on("connection",(socket)=>{
    socket.on("login",(userLogin)=>{
        var u = userLogin.username;
        var p = userLogin.password;

    });
})
