const express = require("express");
const router = express.Router();
const Artwork = require('../../schemas/Canvas');

router.post('/create', (req,res) => {
    requestData = JSON.parse(req.body.data);
    var canvas1 = new Canvas({user_id: requestData.user_id, data_url:requestData.data_url});
    canvas1.save((err)=>{
        if(err) console.log('Failed to create canvas');
        res.end("Saved canvas successfully");
    });
});

router.delete("/:id", (req,res) => {
    Canvas.deleteOne({_id: req.params.id }, function(err){
        if(err){
            res.end("Failed to remove canvas");
        } else{
            res.end("Successfully removed canvas");
        }
    });
});

router.get("/:id",(req,res)=>{
    Canvas.findOne({_id:req.params.id}).exec((err,results) => {
        if(err){return res.end("ERROR");};
        res.end(JSON.stringify(results));
    });
});

module.exports = router;


