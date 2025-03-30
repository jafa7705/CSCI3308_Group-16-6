const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('pages/home');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
