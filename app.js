const express = require("express");
const bodyParser = require("body-parser");
const date = require((__dirname) + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema({
    name: String,
    default: false,
});
const Item = mongoose.model("Item", itemsSchema);

const ListSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema],
});
const List = mongoose.model("List", ListSchema);


const item1 = new Item({
    name: 'Welcome to our todo List',
    default: true,
})
const defaultItems = [item1];


app.get('/', function(req, res) {
    res.render('index');
})

app.post('/', function(req, res) {
    if (req.body.list === 'today') {
        res.redirect('/today');
    } else {
        res.redirect('/new/title');
    }
})

app.get('/:customListName', function(req, res) {
    const listName = req.params.customListName;

    List.findOne({name: listName}, function(err, foundList){
        if(!err){
            if(foundList){
                res.render('list', {
                    listTitle: foundList.name,
                    item: foundList.items,
                })
            }
            else {
                const list = new List({
                name: listName,
                items: defaultItems,
            })

            list.save();
            res.redirect('/'+ listName);
            }
        }
    })
})

app.get('/today', function(req, res) {
    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err)
                    console.log(err);
            });
            res.redirect('/today');
        }

        if(foundItems.length > 0){
            Item.findOneAndRemove({default: true}, function (err){
                if(!err)
                    console.log("Removed");
            });
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
    const listName = req.body.list;

    const item = new Item({
        name: itemName,
        delete: false,
    });

    if(listName === 'Today'){
        item.save();
        res.redirect('/today');
    } 
    else {
        List.findOne({name: listName}, function(err, foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect('/'+ listName);
    })

    }
})

app.post('/delete', function(req, res) {
    const checkedItem = req.body.checkedItem;
    const checkedItemId = checkedItem.slice(0,24);
    const title = checkedItem.slice(25);

    if (title === 'Today'){
        Item.findByIdAndRemove(checkedItemId, function (err){
            if (!err)
                res.redirect('/today');
        });
        
    } else {
        List.findOneAndUpdate({name: title}, 
            {$pull: {items: {_id: checkedItemId}}}, 
            function (err, foundList) {
                if (!err) {
                     res.redirect('/'+ title);
                }
        })
        
    }
})

app.get('/new/title', function(req, res) {
    res.render('title', {});
})

app.post('/new/title', function(req, res) {
    const path = req.body.title;
    res.redirect('/'+ path );
})

app.listen(3000, function(req, res) {
    console.log("listening on port 3000...");
})