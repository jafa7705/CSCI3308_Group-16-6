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

  const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Simulate successful registration
  return res.status(200).json({ message: 'Registration successful' });
});


app.get('/login', (req, res) => {
    res.render('pages/login');
});


app.post('/login', async (res,req) => {
  const {username, password } = req.body;

  const searchQuery = `SELECT * FROM users WHERE username = $1;`;

  db.one(searchQuery, [username])
      .then(async user => {
          const match = await bcrypt.compare(password, user.password);
          if (match){
              res.status(200);
              res.redirect('/home');
          }
          else {
              res.status(400);
              res.render('login', {message: "Wrong username or password"});
          }
      })
      .catch(err => {
          console.log(err)
          res.redirect('/login')
      })
});


app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
  res.status(200).json({ message: 'Registration successful' });
  res.status(400).json({ message: 'Passwords do not match' });

});

module.exports = app.listen(3000);
