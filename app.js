const express = require("express");

const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const items = [];
const workItem = [];

app.get("/", (req, res) => {
  const day=date.getDate();

  res.render("list", { listTitel: day, newlistite: items });
});
app.post("/", (req, res) => {
  const item = req.body.newitem;
  if (req.body.list === "Work") {
    workItem.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitel: "Work list", newlistite: workItem });
});
app.listen(4000, () => {
  console.log("Server is runing on port 3000");
});
