require("dotenv").config();
const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
app.use(express.json());
let refreshTokenArray = [];
app.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    if (!refreshTokenArray.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, token) => {
        const user = { userName: token.userName };
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    });

});

app.delete("/logout", (req, res) => {
    console.log(refreshTokenArray)
    console.log(req.body.token)
    refreshTokenArray = refreshTokenArray.filter(token => token !== req.body.token);
    res.sendStatus(204);

});

app.post("/login", (req, res) => {
    const userName = req.body.userName;
    const user = { userName };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokenArray.push(refreshToken);
    res.json({ accessToken, refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

app.listen(4001);