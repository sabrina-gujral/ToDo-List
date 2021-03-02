const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = [];

app.get('/', function (req, res){
	let today = new Date();
	let date = today.toDateString().slice(3);
	let day = today.toLocaleDateString('en-US', {weekday: 'long'}) + ", " + date;

	res.render('list', {day: day,
		item: items,})
})

app.post('/', function (req, res) {
	item = req.body.item;
	items.push(item);
	res.redirect('/');
})

app.listen(3000, function(req, res){
	console.log("listening on port 3000...");
})
