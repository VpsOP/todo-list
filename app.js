//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect mongoose to locally hosted mongodb server
const mongoURI = "mongodb://localhost:27017/todolistDB"
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }

mongoose.connect(mongoURI, mongoOptions);


const itemsSchema = new mongoose.Schema({ name: String });

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "Welcome to your todolist", });
const item2 = new Item({ name: "Hit the + button to add a new item", });
const item3 = new Item({ name: "<- Check this to delete an item.", });

const defaultItems = [item1, item2, item3];


const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);


// GET Requests

app.get("/", function (req, res) {

  Item.find((err, foundItems) => {

    if (err) {
      console.log(err);
    } else {
      // If there are no items in todolist insert the default items 

      if (foundItems.length === 0) {

        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err)
          } else {
            // console.log("Inserted three items")
          }
        });

        res.redirect("/");

      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
      
    }
    
  });
});

app.get("/lists/:listname", function (req, res) {
  let requestedlist = _.capitalize(req.params.listname);
  List.find({ name: requestedlist }, (err, foundLists) => {
    if(err) {
      console.log(err);
    } else {
      if (foundLists.length === 0) {
        List.insertMany([{ name: requestedlist, items: defaultItems }], (err, inserted) => {
          if(err) {
            console.log(err)
          } else {
            console.log(`Made a new custom list named ${requestedlist}`);
            res.redirect("/lists/" + req.params.listname)
          }
        });
        
      } else {
        List.findOne({ name: requestedlist }, (err, foundList) => {
          if(err) {
            console.log(err)
          } else {
            res.render("list", { listTitle: requestedlist, newListItems: foundList.items });
          }
        })
      }
    }
  })

});

app.get("/about", function (req, res) {
  res.render("about");
});

// POST requests

app.post("/", function(req, res){

  const item = req.body.newItem;
  const list = _.capitalize(req.body.listName)
  
  var newItem = new Item({ name: item, });

  if (list === "Today") {
    // workItems.push(item);
    // res.redirect("/work");

    Item.create(newItem, (err) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(`Successfully added ${newItem} to Todo List`);
        res.redirect("/");
      }
    });

  } else {
    List.findOne({ name: list }, (err, foundList) => {
      if (err) {
        console.log(err)
      } else {
        foundList.items.push(newItem);
        foundList.save();
        var lowercaseListName = _.lowerCase(list);
        res.redirect(`/lists/${lowercaseListName}`)
      }
    })
  }
});


// Post request to delete a specific item from a list.

app.post('/delete', (req, res) => {

  var id = req.body.checkbox;
  var listName = req.body.list;

  if (listName === "Today") {
    Item.findById(id, (err, response) => {
      if (err) {
        console.log(err)
      } else {
        Item.deleteOne({ _id: id }, (error) => {
          if (error) {
            console.log(error);
          } else {
            // console.log(`Removed ${response.name} task`);
            setTimeout(() => {
              res.redirect("/");
            }, 100);

          }
        });
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: id } } }, (err, foundList) => {
      if(err) {
        console.log(err);
      } else {
        var lowercaseListName = _.lowerCase(listName);
        res.redirect(`/lists/${lowercaseListName}`);
      }
    });
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
