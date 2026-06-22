const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const options = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
}

app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(session(options));

app.use(cookieParser())

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errMsg = req.flash("error")
    next()
})
app.get("/getCookies",(req,res) => {
    res.cookie("name","malik")
    res.send("Cookie")
})


app.get("/register",(req,res) => {
    let {name= "anynomous"} = req.query;
    if(name == "anynomous"){
        req.flash("error","User not registered!");   
    }
    else{
        req.flash("success","User registered successfully");
    }
    req.session.name = name;
    res.redirect("/hello");
})

app.get("/hello",(req,res) => {
    res.render("page.ejs",{name:req.session.name})
})
app.get("/reqCount",(req,res) => {
    if(req.session.count){
        req.session.count ++;
    }
    else{
        req.session.count = 1;
    }

    res.send(`You send request ${req.session.count} times`)
})
app.get("/", (req,res) => {
    console.dir(req.cookie);
    res.send("hi iam root")
    
})
app.listen("3000",() => {
    console.log("app is listening on port 3000")
})

