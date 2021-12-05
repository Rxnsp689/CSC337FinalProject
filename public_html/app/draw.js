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

function loadCanvas() {
    var data_url = "";
    var url = document.location.href;
    var params = url.split('?');
    var roomID = params[1].split('=')[1];
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
                  console.log(results);
                  data_url = results[0].data_url;
                  console.log("hello: " +data_url+ "bye");
                }
            });
        }
    });

    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    document.getElementById("canvasimg").src = "";

    if (data_url != "") {
        var img = new Image;
        img.onload = function(){
            ctx.drawImage(img,0,0);
        };
        img.src = data_url;
    }

    canvas.addEventListener("mousemove", function (e) {
        cordinate('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        cordinate('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        cordinate('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        cordinate('out', e)
    }, false);
}

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

function cordinate(res, e) {
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

function draw() {
    ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}

function erase() {
    var m = confirm("Click to Clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
}

function save() {
    var imgName = prompt("Please Enter a name for your master piece");
    var imgData = canvas.toDataURL();
    $.ajax({
        url: "/saveCanvas",
        data: {
            "canvas_id": canvasIdForImg,
            "data_url": imgData,
        },
        dataType: 'json',
        method: "POST",
        contentType: 'application/x-www-form-urlencoded',
        success: function(result){
          results = JSON.parse(result);
          console.log("Created room"+results.room_token);
          window.location='draw.html';
        }
    });
}
