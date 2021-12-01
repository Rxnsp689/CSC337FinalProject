
function logout() {
  var socket = io.connect("http://localhost:3000");
  console.log("in client logout");
  socket.emit("logout",{});
  window.location.href = '../account/index.html';
}

// need to go to different url with roomID like draw/roomID.html?
function joinRoom(){
  console.log("In client join room");
  roomID = $('#room_input').val();
  //roomID = document.getElementById("room_input").val();
  //console.log("room token: " + roomID);
  //var obj = {room_token: roomID};
  $.ajax({
    url: '/room/'+roomID,
    method: "GET",
    //data: JSON.stringify(obj),
    contentType: 'application/json',
    success: function(result){
      results = JSON.parse(result);
      //console.log("Joined room "+roomID);
      console.log("Joined room "+results.room_token);
      window.location='draw.html';
    }
  });
}

// need to go to different url with roomID like draw/roomID.html?
function createRoom(){
  console.log("Client create room");
  $.ajax({
    url: '/createRoom',
    method: "POST",
    contentType: 'application/json',
    success: function(result){

      results = JSON.parse(result);
      console.log("Created room"+results.room_token);
      window.location='draw.html';
    }
  });
}

// how to get user id?
function saveCanvas(){
  console.log("Client save canvas");
  var canvas = document.getElementById('can');
  var dataURL = canvas.toDataURL();
  $.ajax({
    url: '/createCanvas',
    method: "POST",
    contentType: 'application/json',
    success: function(result){

      results = JSON.parse(result);
      console.log("Created canvas"+results.data_url);
      window.location='draw.html';
    }
  });
}
