import {faker} from "@faker-js/faker";
import express from "express";
import { generateUsers } from "./functions.js"
import bodyparser from "body-parser"

const jsonParser = bodyparser.json();
const app = express();

const checkHeaderAuth = req => {
    if (req.headers.get("Authorization") == "Bearer "+"supersecretaccesstoken") return true
    else return false;
}

app.get("/all-users", (req, res) => {
    if(checkHeaderAuth(req)) res.send(generateUsers());
    else {
        res.status(401);
        res.send("Unauthorised");
    }
})

app.get("/all-users/:amount", (req, res) => {
    if(checkHeaderAuth(req)) res.send(generateUsers(req.params.amount));
    else {
        res.status(401);
        res.send("Unauthorised");
    }
})

app.get("/version", (req, res) => {
    res.send("v0.0.3");
})

app.get("/", (req, res) => {
    if(checkHeaderAuth(req)) res.send("Hello from mock sever!");
    else {
        res.status(401);
        res.send("Unauthorised");
    }
})

let regUsers = [

]

app.post("/login", jsonParser, (req, res) => {
    const lookup = regUsers.filter(user => {
        if(user.email == req.body.email && user.password == req.body.password) return true;
    })

    if(lookup.length == 1)
        res.send("Bearer "+"supersecretaccesstoken")
    else {
        res.status(401)
        res.send("Authentication failed")
    }
})

app.post("/register", jsonParser, (req, res) => {
    console.log(req.body)
    const lookup = regUsers.filter(user => {
       if(user.email === req.body.email) return true;
    })
    if (lookup.length > 0) {
        res.status(403)
        res.send("User already registered")
    }
    else {
        const addedUser = {
            email: req.body.email,
            password: req.body.password
        }
        if(addedUser.password !== "" && addedUser.password !== undefined && addedUser.password !== null) {
            regUsers.push(addedUser);
            res.send("User registered succesfuly");
        }
    }

});

app.listen(3000, () => console.log('Example app is listening on port http://localhost:3000.'));






