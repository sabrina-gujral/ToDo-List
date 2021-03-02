const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", 'ejs');

app.get('/', function (req, res){
	var today = new Date();
	var day = today.toLocaleDateString('en-US', {weekday: 'long'});

	res.render('list', {day: day,})
})

app.listen(3000, function(req, res){
	console.log("listening on port 3000...");
})
