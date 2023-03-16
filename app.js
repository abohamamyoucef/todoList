const express = require("express");
const _ = require("lodash");

const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1/todoListDB');
const itemSchema = {
  name:String
};
const Item=mongoose.model("Item",itemSchema);
const item1=new Item({name:"Welcome Item1"});
const item2=new Item({name:"Welcome Item2"});
const item3=new Item({name:"Welcome Item3"});
const defaultItems=[item1,item2,item3];


const listSchema={
  name: String,
  items: [itemSchema]
};
const List=mongoose.model("List", listSchema);

async function getItems(){

  const Items = await Item.find({});
  return Items;

}
async function getList(s){

  const ListTro = await List.findOne({name: s});
  return ListTro;

}


app.get("/", (req, res) => {

  getItems().then(function(foundItems){
    
    if (foundItems.length===0) {
      Item.insertMany(defaultItems)
        .then(function () {
          console.log("Successfully saved defult items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
        res.redirect("/");
    } else {
      res.render("list", { listTitel: "today", newlistItem: foundItems });
    }

  });

});

  

  

  
app.post("/", (req, res) => {
  const itemName = req.body.newitem;
  const listName = req.body.list;

  const item =new Item({
    name:itemName
  });
  if (listName==="today") {
    item.save();
    res.redirect("/");
  } else {
    getList(listName).then(function(foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
      
  
    });
    
  }
 

});


  
app.post("/delete", (req, res) => {
  const chekedItemId = req.body.checbox;
  const listName = req.body.listName;
  if (listName==="today"){
    Item.findByIdAndDelete(chekedItemId)
    .then(function () {
      console.log("Successfully deleted  item from DB");
    })
    .catch(function (err) {
      console.log(err);
    });
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name:listName},{$pull: {items: {_id:chekedItemId}}}).then(function(foundList){
     
      res.redirect("/" + listName);
      
  
    });

  }




});


app.get("/:customListName", (req, res) => {
  const customListName=_.capitalize( req.params.customListName);

  getList(customListName).then(function(foundList){
    
    if (!foundList) {
      const list=new List({
        name:customListName,
        items:defaultItems
    
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      res.render("list", { listTitel: foundList.name, newlistItem: foundList.items });
    }

  });


  
});
app.listen(8000, () => {
  console.log("Server is runing on port 3000");
});
