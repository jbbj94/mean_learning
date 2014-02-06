
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodetest2'); // location of the db
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error: '));
db.once('open', function callback () {
    // successful connection code goes here

    // create schema
    var userSchema = mongoose.Schema({
        username: String,
        email: String,
        fullname: String,
        age: Number,
        location: String,
        gender: String
    });

    // create model from schema
    var User = mongoose.model('User',userSchema);
});


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/userlist', user.userlist(db)); // for drawing from db
app.post('/adduser', user.adduser(db)); // for adding to db
app.delete('/deleteuser/:id',user.deleteuser(db)); // for deleting from database
app.post('/updateuser/:id',user.updateuser(db)); // for updating someone's info

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
