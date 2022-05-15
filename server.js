require("dotenv").config();
const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
app.use(express.json());

const posts = [{
    userName: "Shiv",
    userId: "1123"
},
{
    userName: "Puneet",
    userId: "3456"
}];

app.get("/posts", Authenticate, (req, res) => {
    console.log(req.user);
    res.send(posts.filter(el => el.userName === req.user.userName));
});

app.post("/login", (req, res) => {
    const userName = req.body.userName;
    const user = { userName };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
});

function Authenticate(req, res, next) {    
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;        
        next();
    });
}

app.listen(3001);