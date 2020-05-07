const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.static('public'));

const users = {};
const cookies = {};

const getImageLinks = () => {
  let res = [];
  Object.entries(users).forEach((user) => {
    if (user.meme) {
      res.push(`https://c0d3js59.freedomains.dev/${user.meme}.png`);
    }
  });
  return res;
};

app.get('/cookie', (req, res) => {
  const cookie = req.cookies.userCookie;
  if (!cookie) {
    res.sendStatus(403);
  } else {
    res.status(200).json({ username: cookies[cookie] });
  }
});

app.post('/setCookie', (req, res) => {
  const newCookie = uuid();
  if (users.hasOwnProperty(req.body.username)) {
    res.sendStatus(403);
  } else {
    users[req.body.username] = { cookie: newCookie };
    cookies[newCookie] = req.body.username;
    res.cookie('userCookie', newCookie, { httpOnly: true });
    console.log('cookie has been set');
    res.status(200).json({ username: req.body.username });
  }
});

app.post('/images', (req, res) => {
  let user = req.body.username;
  //if the image hasn't been set for a user
  if (!users[user].meme) {
    const imgId = uuid();
    users[user].meme = imgId;
  } else {
    const imgId = users[user].meme;
  }
  const imageName = imgId + '.png';
  fs.writeFile(path.join(__dirname, './public/', imageName), req.body.img, 'base64', (err) => {
    if (err) console.log(err);
    else {
      const imagesLinks = getImageLinks();
      res.json({ images: imagesLinks });
    }
  });
});
app.listen(process.env.PORT || 8123);
