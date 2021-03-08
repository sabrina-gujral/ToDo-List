const express = require("express");
const bodyParser = require("body-parser");
const date = require((__dirname) + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema({
    name: String,
    delete: false,
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: 'Welcome to our todo List',
    delete: false,
})

const defaultItems = [item1];

const weekdayListSchema = new mongoose.Schema({
    name: String,
    delete: false,
});
const WeekdayItem = mongoose.model("WeekdayItem", weekdayListSchema);


const weekendListSchema = new mongoose.Schema({
    name: String,
    delete: false,
});
const WeekendItem = mongoose.model("WeekendItem", weekendListSchema);

const weekdayList = [];

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
    WeekdayItem.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            WeekdayItem.insertMany(defaultItems, function(err) {
                if (err)
                    console.log(err);
                else
                    console.log("inserted!");
            });
            res.redirect('/weekday');
        }
        res.render('list', {
            listTitle: "Weekday List",
            item: foundItems,
        });

    });
})

app.post('/weekday', function(req, res) {
    let title = req.body.title;
    const itemName = req.body.item;
    const item = new WeekdayItem({
        name: itemName,
        delete: false,
    })

    item.save();
    res.redirect('/weekday');

})


app.get('/weekend', function(req, res) {
    WeekendItem.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            WeekendItem.insertMany(defaultItems, function(err) {
                if (err)
                    console.log(err);
                else
                    console.log("inserted!");
            });
            res.redirect('/weekend');
        }
        res.render('list', {
        listTitle: "Weekend List",
        item: foundItems,
    });

    });
})

app.post('/weekend', function(req, res) {
    const itemName = req.body.item;
    const item = new WeekendItem({
        name: itemName,
        delete: false,
    })

    item.save();
    res.redirect('/weekend');
})


app.get('/today', function(req, res) {
    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err)
                    console.log(err);
                else
                    console.log("inserted!");
            });
            res.redirect('/');
        }

        const day = date.getDate();
        res.render('list', {
            listTitle: day,
            item: foundItems,
        });
    });
})

app.post('/today', function(req, res) {
    const itemName = req.body.item;
    const item = new Item({
        name: itemName,
        delete: false,
    });

    item.save();
    res.redirect('/today');
})

app.listen(3000, function(req, res) {
    console.log("listening on port 3000...");
})