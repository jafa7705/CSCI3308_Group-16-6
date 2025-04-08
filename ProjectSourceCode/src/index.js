const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');
const hbs = require('hbs'); // ✅ To register and use partials

// ------------------ Database Connection ------------------
const db = pgp({
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB || 'users_db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pwd',
});

// ------------------ Middleware Setup ------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ------------------ View Engine Setup ------------------
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Register partials directory
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// ------------------ Static Files ------------------
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// ------------------ Routes ------------------

// Home
app.get('/', (req, res) => {
  res.render('pages/home');
});

// Profile
app.get('/profile', async (req, res) => {
  const userID = 1;           // TODO: Replace with session-based user ID
  const profileUserID = 1;    // TODO: Replace with route param or session

  try {
    const user = await db.one('SELECT user_id, username, email, isClient, bio, website, location FROM users WHERE user_id = $1', [profileUserID]);
    let viewingUser;

    try {
      viewingUser = await db.one('SELECT isClient AS "isClient" FROM users WHERE user_id = $1', [userID]);
    } catch (err) {
      console.error("Viewing user not found:", err);
      viewingUser = { isClient: false };
    }

    const isOwner = userID === profileUserID;
    const isOwnerOrClient = isOwner || viewingUser.isClient;

    res.render('pages/profile', { user, isOwner, isOwnerOrClient });
  } catch (err) {
    console.error(err);
    res.status(500).send('ERROR: Could not get profile');
  }
});

app.post('/profile/update', async (req, res) => {
  const userID = 1; // TODO: Replace with session-based user ID
  const { website, location, bio } = req.body;

  try {
    await db.none('UPDATE users SET website = $1, location = $2, bio = $3 WHERE user_id = $4', [
      website,
      location,
      bio,
      userID,
    ]);
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('ERROR: Could not update profile info');
  }
});

// Register
app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    return res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error inserting user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
app.get('/login', (req, res) => {
  res.render('pages/login');
});

/* Uncomment this if needed and you want to test login with DB
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const searchQuery = `SELECT * FROM users WHERE username = $1;`;

  try {
    const user = await db.one(searchQuery, [username]);
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.redirect('/');
    } else {
      res.status(400);
      res.render('pages/login', { message: 'Wrong username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).render('pages/login', { message: 'Wrong username or password' });
  }
});
*/

// Welcome test route
app.get('/welcome', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Welcome!' });
});

// Post page
app.get('/post', (req, res) => {
  res.render('pages/post');
});

// ------------------ Start Server ------------------
module.exports = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
