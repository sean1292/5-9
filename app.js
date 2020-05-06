const express = require('express');
const cookieParser = require('cookie-parser');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cookieParser());
app.use(express.static('public'));

const users = {};
const cookies = {};
app.get('/cookie', (req, res) => {
  const cookie = req.cookies.userCookie;
  if (!cookie) {
    res.sendStatus(404);
  } else {
    res.status(200).json({ username: cookies[cookie] });
  }
});

app.listen(process.env.PORT || 8123);
