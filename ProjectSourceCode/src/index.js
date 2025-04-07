const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');

// Setup database connection using environment variables
const db = pgp({
  host: 'db', // matches service name in docker-compose.yml
  port: 5432,
  database: process.env.POSTGRES_DB || 'users_db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pwd',
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// Routes
app.get('/', (req, res) => {
  res.render('pages/home');
});


// Profile ROutes
app.get('/profile', async (req, res) => {
  const userID = 3; //TODO: Replace with login stuff
  const profileUserID = 1; // TODO: replace with the profile ID on the page

  try {
      const user = await db.one('SELECT user_id, username, email, isClient, bio, website, location FROM users WHERE user_id = $1', [profileUserID]);
      const isOwner = userID === profileUserID;
      const isOwnerOrClient = isOwner || (await db.one('SELECT isClient FROM users WHERE user_id = $1', [userID])).isClient;

      res.render('pages/profile', { user, isOwner, isOwnerOrClient });
  } catch (err) {
      console.error(err);
      res.status(500).send('ERROR: Could not get profile');
  }
});



app.get('/register', (req, res) => {
  res.render('pages/register');
});

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const searchQuery = `SELECT * FROM users WHERE username = $1;`;

  try {
    const user = await db.one(searchQuery, [username]);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.redirect('/home');
    } else {
      res.status(400);
      res.render('pages/login', { message: 'Wrong username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).render('pages/login', { message: 'Wrong username or password' });
  }
});

app.get('/welcome', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome!' });
});


app.get('/post', (req, res) => {
  res.render('pages/post');
});

module.exports = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
