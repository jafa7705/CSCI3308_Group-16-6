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

app.post('/register', async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await db.none(
      'INSERT INTO users(username, password) VALUES($1, $2)',
      [req.body.username, hash]
    );
    res.redirect('/login');
  } 
  catch (error) {
    console.error(error);
    res.redirect('/register');
  }
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

module.exports = app.listen(3000);