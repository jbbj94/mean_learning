// userlist array
var userListData = [];
var updateID = []; // id of person getting ready to update
var user2update = {};

// get DOM ready ======================
$(document).ready(function() { // when doc is ready...
    populateTable(); // populate user table on init page load

    // username link click
    $('#userList table tbody').on('click','td a.linkshowuser', showUserInfo);

    // add user button click
    $('#btnAddUser').on('click', addUser);

    // delete user button click
    $('#userList table tbody').on('click','td a.linkdeleteuser', deleteUser);

    // update user button click
    $('#userList table tbody').on('click','td a.linkupdateuser', enableUpdateUser);
    // submit update button click
    $('#btnUpdateUser').on('click', updateUser);

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
            tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>' // show click2update

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

    console.log('clicked delete');

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


function enableUpdateUser(event){
    event.preventDefault();

    // get user name
    var thisUserID = $(this).attr('rel'); // retreive user id from link rel attribute
    updateID = thisUserID; // set global id (for submitting update)

    // get user index in array
    var arrayPosition = userListData.map(function(arrayItem){
        return arrayItem._id;}
        ).indexOf(thisUserID);

    var thisUserObject = userListData[arrayPosition];
    user2update = thisUserObject; // set global object (for submitting update)

    // set defaults for update data entry
    $('#updateUser fieldset :input[type="text"]:not(#inputUserName)').css('background-color','#FFF');
    // allow edits to all fields except username
    $('#updateUser fieldset :input[type="text"]:not(#inputUserName)').attr('readonly',false);
    $('#updateUser fieldset #btnUpdateUser').prop('disabled',false); // enable submit button
    // default placeholders
    $('#updateUser fieldset input#inputUserName').attr('placeholder',thisUserObject.username);
    $('#updateUser fieldset input#inputUserEmail').attr('placeholder',thisUserObject.email);
    $('#updateUser fieldset input#inputUserFullname').attr('placeholder',thisUserObject.fullname);
    $('#updateUser fieldset input#inputUserAge').attr('placeholder',thisUserObject.age);
    $('#updateUser fieldset input#inputUserLocation').attr('placeholder',thisUserObject.location);
    $('#updateUser fieldset input#inputUserGender').attr('placeholder',thisUserObject.gender);
}

function updateUser(event){
    console.log('clicked update');

    // popup confirmation dialogue
    var confirmation = confirm('you sure you want to update?');

    // check confirm
    if(confirmation===true){
        // if confirmed, delete

        // replace non-empty fields with updated input
        // * user2update was made in enableUpdateUser
        if($('#updateUser fieldset input#inputUserEmail').val() !== ''){
            user2update.email = $('#updateUser fieldset input#inputUserEmail').val();
        }
        if($('#updateUser fieldset input#inputUserFullname').val() !== ''){
            user2update.fullname = $('#updateUser fieldset input#inputUserFullname').val();
        }
        if($('#updateUser fieldset input#inputUserAge').val() !== ''){
            user2update.age = $('#updateUser fieldset input#inputUserAge').val();
        }
        if($('#updateUser fieldset input#inputUserLocation').val() !== ''){
            user2update.location = $('#updateUser fieldset input#inputUserLocation').val();
        }
        if($('#updateUser fieldset input#inputUserGender').val() !== ''){
            user2update.gender = $('#updateUser fieldset input#inputUserGender').val();
        }

        // console.log(user2update);
        // console.log(updateID);

        // Use AJAX to post the object to our updateuser service
        $.ajax({
          type: 'POST',
          data: user2update,
          url: '/updateuser/' + updateID,
          dataType: 'JSON'
        }).done(function( response ) {

          // Check for successful (blank) response
          if (response.msg === '') {

            // Clear the form inputs
            $('#updateUser fieldset input').val('');

            // Update the table
            populateTable();

          }
          else {
            // If something goes wrong, alert the error message that our service returned
            console.log('Error:', user2update);
            alert('Error: ' + response.msg.responseText);
          }
        });
    };
};