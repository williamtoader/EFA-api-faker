import {faker} from "@faker-js/faker";
import express from "express";
import { generateUsers } from "./functions.js"

const app = express();

app.get("/all-users", (req, res) => {
    res.send(generateUsers());
})

app.get("/all-users/:amount", (req, res) => {
    res.send(generateUsers(req.params.amount));
})

app.get("/version", (req, res) => {
    res.send("v0.0.1");
})

app.listen(3000, () => console.log('Example app is listening on port http://localhost:3000.'));






