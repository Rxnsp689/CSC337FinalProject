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

function viewDrawings() {
  /*
  $.get('/app/get/user/listings', (ldata) => {
      if (String(ldata).includes("<!DOCTYPE html>")) {
          window.location = "/account/index.html";
          return;
      };
      $("#home_right").empty();
      ldata = JSON.parse(ldata);
      ldata = ldata["listings"];
      for (let i = 0; i < ldata.length; i++) {
          $.get('/app/get/listing/' + ldata[i], (data) => {
              data = JSON.parse(data);
              $("#home_right").append("<div class='item' id=item" + i + "></div>");
              $("#item"+i).append("<p hidden id=objid" + i + ">" + data["_id"] + "</p>");
              $("#item"+i).append("<p>" + data["title"] + "</p>");
              $("#item"+i).append("<p>" + data["description"] + "</p>");
              $("#item"+i).append("<p>" + data["image"] + "</p>");
              $("#item"+i).append("<p>" + data["price"] + "</p>");
              $("#item"+i).append("<p>" + data["status"] + "</p>");
              if (data["status"] === "SOLD") {
                  $("#item"+i).append("<button type=\"button\" id=item" + i + " onclick=\"buyItem(" + i + ")\" >SOLD!</button>");
              } else {
                  $("#item"+i).append("<button type=\"button\" id=item" + i + " onclick=\"buyItem(" + i + ")\" >Buy Now!</button>");
              }
          });
      }
  });
  */
}

