const express = require("express");
const bodyParser = require("body-parser");
const date = require((__dirname) + "/date.js");

const app = express();

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
let weekdayList = [];
let weekendList = [];

app.get('/', function(req, res) {
    res.render('index');
})

app.post('/', function(req, res) {
    if (req.body.list === 'weekday') {
        res.redirect('/weekday');
    } else if (req.body.list === 'weekend') {
        res.redirect('/weekend')
    } else {
        res.redirect('/today');
    }
})


app.get('/weekday', function(req, res) {
    res.render('list', {
        listTitle: "Weekday List",
        item: weekdayList,
    });
})

app.post('/weekday', function(req, res) {
	let title = req.body.title;
	res.write(title);
    let item = req.body.item;
    weekdayList.push(item);
    res.render('list', {
        listTitle: title,
        item: weekdayList,
    });
})


app.get('/weekend', function(req, res) {
    res.render('list', {
        listTitle: "Weekend List",
        item: weekendList,
    });
})

app.post('/weekend', function(req, res) {
    let item = req.body.item;
    weekendList.push(item);
    res.redirect('/weekend');
})


app.get('/today', function(req, res) {
    const day = date.getDate();
    res.render('list', {
        listTitle: day,
        item: items,
    });
})

app.post('/today', function(req, res) {
    let item = req.body.item;
    items.push(item);
    res.redirect('/today');
})

app.listen(3000, function(req, res) {
    console.log("listening on port 3000...");
})