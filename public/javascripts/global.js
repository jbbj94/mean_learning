// userlist array
var userListData = [];

// get DOM ready ======================
$(document).ready(function() { // when doc is ready...
    populateTable(); // populate user table on init page load

    // username link click
    $('#userList table tbody').on('click','td a.linkshowuser', showUserInfo);

    // add user button click
    $('#btnAddUser').on('click', addUser);

    // delete user button click
    $('#userList table tbody').on('click','td a.linkdeleteuser', deleteUser);
});

// fcns ======================

// fill table w data
function populateTable() {
    // empty content string
    var tableContent = ''; // reinit
    // jQuery AJAX call for JSON
    $.getJSON('/userlist', function(data){

        // stick user data array into userlist variable in global object
        userListData = data;
        // for each item in our JSON...
        $.each(data,function(){
            tableContent += '<tr>'; // new row
            // populate columns of new row
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>'; // show username
            tableContent += '<td>' + this.email + '</td>'; // show email
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>' // show click2delete

            // inject content string into existing html
            $('#userList table tbody').html(tableContent);
        });
    });
}


// show user info
function showUserInfo(event){
    event.preventDefault(); // prevent link from firing
    var thisUserName = $(this).attr('rel'); // retreive username from link rel attribute
    var arrayPosition = userListData.map(function(arrayItem){
        return arrayItem.username;}
        ).indexOf(thisUserName);

    // get our user object
    var thisUserObject = userListData[arrayPosition];
    // populate info box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

// add user to db!!
// Add User
function addUser(event) {
  event.preventDefault;

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; } // err if index is empty
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/adduser',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addUser fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

function deleteUser(event){
    event.preventDefault();

    // popup confirmation dialogue
    var confirmation = confirm('you sure you want to delete?');

    // check confirm
    if(confirmation===true){
        // if confirmed, delete
        $.ajax({
            type: 'DELETE',
            url: '/deleteuser/' + $(this).attr('rel')
        }).done(function(response){
            // check successful delete
            if(response.msg === ''){
            }
            else {
                alert('Error: '+response.msg);
            }

        // update table
        populateTable();
        });
    }
    else { // if no confirm, do nothing
        return false
    }
};