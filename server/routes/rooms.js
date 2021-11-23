const express = require("express");
const router = express.Router();
//const Room = require('../../schemas/Room');

function generateRoomID(tokenLength){
    var possibleChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lenChars = possibleChars.length;
    var id = "";
    for(var i = 0; i<tokenLength;i++){
        id+=possibleChars.charAt(Math.floor(Math.random() * lenChars));
    }
    return id;
}

router.post("/createRoom", (req,res) => {
    console.log("in create room");
    requestData = JSON.parse(req.body.data);

    var room1 = new Room({host_id: requestData.userId, room_token: generateRoomID(15)});

    room1.save((err)=>{
        if(err) console.log('PROBLEM');
        console.log("SAVED");
        //res.end("SAVED");
    });
    res.end(JSON.stringify(room1));
});
router.post("/createRoom", (req,res) => {
    console.log("in create room");
    //requestData = JSON.parse(req.body.data);
    // need to get user's id (currently using test1)
    var room1 = new Room({host_id: "619c4e9f139ae6bd7df25b6a", room_token: generateRoomID(15)});

    room1.save((err)=>{
        if(err) console.log('PROBLEM');
        //res.end("SAVED");
    });
    res.end(JSON.stringify(room1));
});

router.get("/joinRoom", (req,res) => {
    requestData = JSON.parse(req.body.data);
    Room.findOne({room_token:requestData.room_token}).then(room => {
        if(room){
            res.end(JSON.stringify(room));
        } else{
            res.end("Room not found");
        }
    });
});

router.get("/room/:tokenid", (req,res) => {
    Room.findOne({_id:req.params.tokenid}).then(room => {
        if(room){
            res.end(JSON.stringify(room));
        } else{
            res.end("Room not found");
        }
    });
});
module.exports = router;
