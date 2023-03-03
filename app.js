require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const lo = require('lodash');

mongoose.set('strictQuery', false); 

//Conexão com uma database local, servida no meu computador
/* mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true}, () => {
    console.log("Connected to ToDo List DB");
}); */

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true}, () => {
    console.log("Connected to ToDo List DB");
});

const itemSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["open", "done"]
        }
    }
);

const Item = mongoose.model("Item", itemSchema);

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

let listDate = date.getDate();

app.get("/",function(req,res){

    Item.find({type:"home", date: {$eq: listDate}}, {description:1, status:1}, function(err, items){ 
        if(err){
            console.log(err);
        } else{
            res.render("list", {dateToShow: listDate, listType: "Home", newListItems: items});    
        }
    });
})

app.post("/",function(req,res){
    const newItem = new Item(
        {
            description: req.body.newItem,
            date: req.body.selectedDay,
            type: lo.toLower(req.body.listSelect),
            status: "open"
        }
    );

    newItem.save();

    if(req.body.listSelect == "Home"){
        res.redirect("/");
    } else{
        res.redirect("/" + req.body.listSelect);
    }
})

app.post("/update",function(req,res){
    listDate = req.body.selectedDay;
    if(req.body.operationType == "delete"){
        Item.deleteOne({_id: {$eq: req.body.itemID}}, function(err){
            if(err){
                console.log(err);
            } else{
                console.log("Item is deleted.");
            }    
        });
    } else {
        if(req.body.itemCheckbox){
            Item.updateOne({_id: {$eq: req.body.itemID}}, {status: "done"}, function(err){
                if(err){
                    console.log(err);
                } else{
                    console.log("Item is marked done.");
                }
            });
        } else{
            Item.updateOne({_id: {$eq: req.body.itemID}}, {status: "open"}, function(err){
                if(err){
                    console.log(err);
                } else{
                    console.log("Item is marked open.");
                }
            });
        }
    }

    if(req.body.listSelect == "Home"){
        res.redirect("/");
    } else{
        res.redirect("/" + req.body.listSelect);
    }
})

app.get("/:custom",function(req,res){
    const listName = lo.toLower(req.params.custom);
    const listNameTitle = lo.capitalize(listName);

    Item.find({type: listName, date: {$eq: listDate}}, {description:1, status:1}, function(err, items){ 
        if(err){
            console.log(err);
        } else{
            res.render("list", {dateToShow: listDate, listType: listNameTitle, newListItems: items});    
        }
    });
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server running on Cyclic.");
})