const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todolistDB', { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false });

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

var schemas = {'Item': Item, 'List': List};
module.exports = schemas;