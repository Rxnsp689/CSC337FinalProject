/* Log user in */
var socket = io();
function login() {
    let u = $('#usernameLogin').val();
    let p = $('#passwordLogin').val();
    $('#usernameLogin').val('');
    $('#passwordLogin').val('');
    /*socket.emit("login", {
      username: u;
      password: p
    });*/
    $.get(
      '/account/login/' + u + '/' + encodeURIComponent(p),
      (data, status) => {
          alert(data);
          if (data == 'LOGIN') {
            window.location.href = '/app/home.html';
          }
    });
}
/* Create a new account */
function createAccount() {
    let u = $('#usernameCreate').val();
    let p = $('#passwordCreate').val();
    $('#usernameCreate').val('');
    $('#passwordCreate').val('');
    $.get(
      '/account/create/' + u + '/' + encodeURIComponent(p),
      (data, status) => {
          alert(data);
    });
}

