
/*
Log user out
*/
function logout() {
  console.log("client side logout");
  $.ajax({
    url: '/logout',
    method: "GET",
    contentType: 'application/json',
    success: function(result){
      console.log("successfully logged out");
      window.location.href = '../account/index.html';
    }
  });
}

/*
Join room by taking the room name token and passing it to draw.html
*/
function joinRoom(){
  console.log("In client join room");
  roomID = $('#room_input').val();
  $.ajax({
    url: '/room/'+roomID,
    method: "GET",
    contentType: 'application/json',
    success: function(result){
      results = JSON.parse(result);
      console.log("Joined room "+results.room_token);
      window.location='draw.html?token='+results.room_token;
    }
  });
}

/*
Create room by creating room name token and passing it to draw.html
*/
function createRoom(){
  console.log("Client create room");
  $.ajax({
    url: '/createRoom',
    method: "POST",
    contentType: 'application/json',
    success: function(result){
      results = JSON.parse(result);
      console.log("Created room"+results.room_token);
      window.location='draw.html?token='+results.room_token;
    }
  });
}

/*
Save canvas drawing to the db
*/
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
