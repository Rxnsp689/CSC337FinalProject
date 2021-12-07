/*
JS for allowing users to draw on the canvas element.
Daniel Ryngler and Sophia Wang
*/

// Attribute of the canvas to be able to draw on it
var canvas;
var ctx;
var flag = false;
var oldX = 0;
var newX = 0;
var oldY = 0;
var newY = 0;
var cord_flag = false;
var x = "black";
var y = 2;
var canvasIdForImg = "";

/*
 Function called when page is first loaded
 It adds the previous drawing from the group to the canvas and 
 initializes the canvas to be able to be drawn on.
*/
function loadCanvas() {
    var data_url = "";
    var url = document.location.href;
    if(url.includes("token")){
        var params = url.split('?');
        var roomID = params[1].split('=')[1];
        $("#room_token").val(roomID);
        console.log("roomID: " + roomID);
        $.ajax({
            url: '/room/'+roomID,
            method: "GET",
            contentType: 'application/x-www-form-urlencoded',
            success: function(result){
                results = JSON.parse(result);
                console.log(results);
                canvasIdForImg = results.canvas_id;
                console.log("Canvas Id ", canvasIdForImg);

                $.ajax({
                    url: '/getCanvas/'+canvasIdForImg,
                    method: "GET",
                    contentType: 'application/x-www-form-urlencoded',
                    success: function(result){
                      results = JSON.parse(result);
                      data_url = results[0].data_url;
                      if (data_url !== "") {
                        console.log("loading image");
                        var img = new Image;
                        img.onload = function(){
                            ctx.drawImage(img,0,0);
                        };
                        img.src = data_url;
                      }
                    }
                });
            }
        });
    }

    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    document.getElementById("canvasimg").src = "";

    if (data_url !== "") {
        console.log("loading image");
        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = data_url;
    }

    canvas.addEventListener("mousemove", function (e) {
        movePosition('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        movePosition('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        movePosition('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        movePosition('out', e)
    }, false);
}

/*
Function to the return color of the color item clicked on
*/
function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 2;

}

/*
Function to determine where to begin drawing (x,y) coordinates
and call the draw function to being drawing.
*/
function movePosition(res, e) {
    if (res == 'down') {
        oldX = newX;
        oldY = newY;
        newX = e.clientX - canvas.offsetLeft;
        newY = e.clientY - canvas.offsetTop;

        flag = true;
        cord_flag = true;
        if (cord_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(newX, newY, 2, 2);
            ctx.closePath();
            cord_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            oldX = newX;
            oldY = newY;
            newX = e.clientX - canvas.offsetLeft;
            newY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

/*
Function to draw on the canvas
*/
function draw() {
    ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

/*
Function to erase parts of drawing on the canvas
*/
function erase() {
    var m = confirm("Click to Clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

/*
Function to save canvas drawing. Calls server to save the data_url to be able 
Use the drawing again in the room.
*/
function save() {
    var imgName = prompt("Please Enter a name for your master piece");
    var imgData = canvas.toDataURL();
    body = {
        canvas_id: canvasIdForImg,
        data_url: imgData,
    };
    $.post("/saveCanvas", body, (data) => {
        console.log("saved image");
    });
}
