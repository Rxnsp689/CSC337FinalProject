//var socket = io();
function logout() {
  //socket.emit("disconnect");
  window.location.href = '../account/index.html';
}

// need to go to different url with roomID like draw/roomID.html?
function joinRoom(){
  roomID = document.getElementById("room_input");
  var obj = {room_token: roomID};
  $.ajax({
    url: '/joinRoom',
    method: "GET",
    data: JSON.stringify(obj),
    contentType: 'application/json',
    success: function(result){
      console.log("Joined room"+roomID);
      window.location='draw.html';
    }
  });
}

// need to go to different url with roomID like draw/roomID.html?
function createRoom(){
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

