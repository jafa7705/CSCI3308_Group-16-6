const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');
const exphbs = require('express-handlebars');

// Setup database connection using environment variables
const db = pgp({
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB || 'users_db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pwd',
});


// Setup view engine
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));

// Middleware setup
// ------------------ Middleware Setup ------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));



// Change by Jiaye, Wait for test
// Register partials
const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// ------------------ Static Files ------------------
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// ---------------- ROUTES ----------------

// Home with posts
app.get('/', async (req, res) => {
  try {
    const posts = await db.any(`
      SELECT p.title, p.description, p.date_created, p.category, u.username
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      ORDER BY p.date_created DESC
    `);
    res.render('pages/home', { posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error loading posts.');
  }
});

// Post form
app.get('/post', (req, res) => {
  res.render('pages/post');
});

// Submit post (automatically sets current timestamp)
app.post('/submit', async (req, res) => {
  const { title, description, category } = req.body;
  const userID = 1; // TODO: Replace with session-based user ID

  try {
    await db.none(
      `INSERT INTO posts (user_id, title, description, date_created, category) 
       VALUES ($1, $2, $3, NOW(), $4)`,
      [userID, title, description, category]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error submitting post:', err);
    res.status(500).send('Error submitting post.');
  }
});

// Profile page
app.get('/profile', async (req, res) => {
  const userID = 1;            //Id of user viewing Page     TODO: Make this work with login
  const profileUserID = 1;     //ID of profile page

  try {
    const user = await db.one(
      'SELECT user_id, username, email, isClient AS "isClient", bio, website, location FROM users WHERE user_id = $1',
      [profileUserID]
    );

    const posts = await db.any(
      `SELECT title, description, date_created, category 
       FROM posts 
       WHERE user_id = $1 
       ORDER BY date_created DESC`,
      [profileUserID]
    );

    let viewingUser;
    try {
      viewingUser = await db.one('SELECT isClient AS "isClient" FROM users WHERE user_id = $1', [userID]);
    } catch (err) {
      console.error("Viewing user not found:", err);
      viewingUser = { isClient: false };
    }

    const isOwner = userID === profileUserID;
    const isOwnerOrClient = isOwner || viewingUser.isClient;

    res.render('pages/profile', { user, posts, isOwner, isOwnerOrClient });
  } catch (err) {
    console.error(err);
    res.status(500).send('ERROR: Could not get profile');
  }
});

// Update profile
app.post('/profile/update', async (req, res) => {
  const userID = 1;
  const { website, location, bio } = req.body;

  try {
    await db.none(
      'UPDATE users SET website = $1, location = $2, bio = $3 WHERE user_id = $4',
      [website, location, bio, userID]
    );
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('ERROR: Could not update profile info');
  }
});

// Registration
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

// Login page
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// (Optional) Login handling
/*
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

// ---------------- START SERVER ----------------
module.exports = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
