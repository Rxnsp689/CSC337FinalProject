/* Log user in */

function login() {
    let u = $('#usernameLogin').val();
    let p = $('#passwordLogin').val();
    $('#usernameLogin').val('');
    $('#passwordLogin').val('');
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
    console.log("client create user");
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

