const express = require("express");
const router = express.Router();
const Room = require('../../schemas/Room');

function generateRoomID(tokenLength){
    var possibleChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lenChars = possibleChars.length;
    var id = "";
    for(var i = 0; i<tokenLength;i++){
        id+=possibleChars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}

router.post("/create", (req,res) => {
    requestData = JSON.parse(req.body.data);
    var room1 = new Room({host_id: requestData.userId, room_token: generateRoomID(15)});

    room1.save((err)=>{
        if(err) console.log('PROBLEM');
        res.end("SAVED");
    });
});

router.get("/join", (req,res) => {
    requestData = JSON.parse(req.body.data);
    Room.findOne({room_token:requestData.room_token}).then(room => {
        if(room){
            res.end(JSON.stringify(room));
        } else{
            res.end("Room not found");
        }
    });
});

router.get("/:tokenid", (req,res) => {
    Room.findOne({_id:req.params.tokenid}).then(room => {
        if(room){
            res.end(JSON.stringify(room));
        } else{
            res.end("Room not found");
        }
    });
});
module.exports = router;