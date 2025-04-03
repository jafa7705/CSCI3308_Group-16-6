const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

app.use('/resources', express.static(path.join(__dirname, 'resources')));

app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/profile', (req, res) => {
  res.render('pages/profile');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
  });

app.get('/login', (req, res) => {
    res.render('pages/login');
});

module.exports = app.listen(3000);