const express = require("express");
const bodyParser = require("body-parser");
const date = require((__dirname) + "/date.js");
const schemas = require((__dirname) + "/db.js");
const Item = schemas.Item;
const List = schemas.List;

const app = express();

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

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

app.get('/l/:customListName', function(req, res) {
    const listName = req.params.customListName;

    List.findOne({ name: listName }, function(err, foundList) {
        if (!err) {
            if (foundList) {
                res.render('list', {
                    listTitle: foundList.name,
                    item: foundList.items,
                    date: null
                })
            } else {
                const list = new List({
                    name: listName,
                    items: defaultItems,
                })

                list.save();
                res.redirect('/l/' + listName);
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

        // if (foundItems.length > 0) {
        //     Item.findOneAndRemove({ default: true }, function(err) {
        //         if (!err)
        //             console.log("Removed");
        //     });
        // }

        const day = date.getDate();
        res.render('list', {
            listTitle: 'Today',
            item: foundItems,
            date: day
        });
    });
})

app.post('/today', function(req, res) {
    const itemName = req.body.item;
    const listName = req.body.list;

    const item = new Item({
        name: itemName,
        default: false,
    });

    if (listName === 'Today') {
        item.save();
        res.redirect('/today');
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect('/l/' + listName);
        })

    }
})

app.post('/delete', function(req, res) {
    const checkedItem = req.body.checkedItem;
    const checkedItemId = checkedItem.slice(0, 24);
    const title = checkedItem.slice(25);

    if (title === 'Today') {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err)
                res.redirect('/today');
        });

    } else {
        List.findOneAndUpdate({ name: title }, { $pull: { items: { _id: checkedItemId } } },
            function(err, foundList) {
                if (!err) {
                    res.redirect('/l/' + title);
                }
            })

    }
})

app.get('/new/title', function(req, res) {
    res.render('title', {});
})

app.post('/new/title', function(req, res) {
    const path = req.body.title;
    let item = {
        name: path,
    }
    res.redirect('/l/' + path);
})

app.get('/lists/all', function(req, res) {
    List.find({}, { _id: 0 }, function(err, foundList) {
        if (err)
            console.log(err);
        else
            res.render('compiled_lists', { lists: foundList })
    })
})

app.listen(3000, function(req, res) {
    console.log("listening on port 3000...");
})