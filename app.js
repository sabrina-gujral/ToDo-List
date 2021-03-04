const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items = [];
let weekdayList = [];
let weekendList = [];

app.get('/weekday', function (req, res){
	res.render('list', {listTitle: "Weekday List",
		item: weekdayList,});
} )

app.post('/weekday', function (req, res) {
	let item = req.body.item;
	weekdayList.push(item);
	res.render('list', {listTitle: "Weekday List",
		item: weekdayList,});
})

app.get('/weekend', function (req, res){
	res.render('list', {listTitle: "Weekend List",
		item: weekendList,});
} )

app.post('/weekend', function (req, res) {
	let item = req.body.item;
	weekendList.push(item);
	res.redirect('/weekend');
})

app.get('/today', function (req, res){
	let today = new Date();
	let date = today.toDateString().slice(3);
	let day = today.toLocaleDateString('en-US', {weekday: 'long'}) + ", " + date;
	res.render('list', {listTitle: day,
		item: items,});
} )

app.post('/today', function (req, res) {
	let item = req.body.item;
	items.push(item);
	res.redirect('/today');
})

app.listen(3000, function(req, res){
	console.log("listening on port 3000...");
})
