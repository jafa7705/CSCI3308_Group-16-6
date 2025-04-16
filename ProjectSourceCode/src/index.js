const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');
const exphbs = require('express-handlebars');
const session = require('express-session');
const apiKey = process.env.API_KEY;

// Setup database connection using environment variables
const db = pgp({
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB || 'users_db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pwd',
});

/* Images part */
const fs = require('fs');
const multer = require('multer');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

// Filters out non images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// Limits filesize
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Setup view engine
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));

// ------------------ Firebase Setup -------------------
async function setupFirebase() {
  const { initializeApp } = await import("firebase/app");
  const { getDatabase, ref, push, onChildAdded, serverTimestamp } = await import("firebase/database");

  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "csci3308group16-6.firebaseapp.com",
    projectId: "csci3308group16-6",
    storageBucket: "csci3308group16-6.firebasestorage.app",
    messagingSenderId: "626233172851",
    appId: "1:626233172851:web:1f3b00bcc115bb964c5b06",
    measurementId: "G-KCF918HXMH",
    databaseURL: "https://csci3308group16-6-default-rtdb.firebaseio.com/"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);
  const messagesRef = ref(database, 'messages');

  return { database, messagesRef, push, onChildAdded, serverTimestamp };
}

let database, messagesRef, push, onChildAdded, serverTimestamp;

setupFirebase().then((firebaseModules) => {
  database = firebaseModules.database;
  messagesRef = firebaseModules.messagesRef;
  push = firebaseModules.push;
  onChildAdded = firebaseModules.onChildAdded;
  serverTimestamp = firebaseModules.serverTimestamp;

  if(onChildAdded && messagesRef) {
    onChildAdded(messagesRef, (snapshot) => {
      const message = snapshot.val();
    });
  }

});


// Middleware setup
// ------------------ Middleware Setup ------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));



// Change by Jiaye, Wait for test
// Register partials
const hbs = require('hbs');
const { connect } = require('http2');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
  })
);


// ------------------- Messaging Functions --------------------
function sendMessage(sender, text) {
  if (push && messagesRef && serverTimestamp) {
    push(messagesRef, {
      sender: sender,
      text: text,
      timestamp: serverTimestamp()
    });
  }
}


// ------------------ Static Files ------------------
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// ---------------- ROUTES ----------------

// Home with posts
app.get('/', async (req, res) => {
  try {
    const posts = await db.any(
      `SELECT p.title, p.description, p.date_created, p.category, p.image, u.username
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       ORDER BY p.date_created DESC`
    );
    
    res.render('pages/home', { posts, user: req.session.user });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error loading posts.');
  }
});

// Post form
app.get('/post', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('pages/post', { user: req.session.user });
});

// Submit post (automatically sets current timestamp)
app.post('/submit', upload.single('postImage'), async (req, res) => {
  const { title, description, category } = req.body;
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userID = req.session.user.user_id;

  try {
    const imagePath = req.file ? req.file.filename : null; // added post image path

    await db.none(
      `INSERT INTO posts (user_id, title, description, date_created, category, image) 
       VALUES ($1, $2, $3, NOW(), $4, $5)`,
      [userID, title, description, category, imagePath]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error submitting post:', err);
    res.status(500).send('Error submitting post.');
  }
});



// Profile page
app.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const profileUserID = req.query.user_id ? parseInt(req.query.user_id) : (req.session.user ? req.session.user.user_id : 1);

  const isOwner = true; // always the logged-in user's own profile
  const isOwnerOrClient = req.session.user && req.session.user.isClient;

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

    let connections = [];
    if (user.isClient) {
      //return all artists the employer (client) is connected with
      connections = await db.any(
        'SELECT u.username, u.user_id FROM users u INNER JOIN connections c ON u.user_id = c.artist_id WHERE c.employer_id = $1',
        [user.user_id]
      );
    } else if (!user.isClient) {
      //return all employers the artist is connected with
      connections = await db.any(
        'SELECT u.username, u.user_id FROM users u INNER JOIN connections c ON u.user_id = c.employer_id WHERE c.artist_id = $1',
        [user.user_id]
      );
    }

    res.render('pages/profile', {
      user,
      posts,                 
      connections,
      sessionUser: req.session.user,
      isOwner,
      isOwnerOrClient,
      canConnect: user.isClient,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('ERROR: Could not get profile');
  }
});

// Update profile
app.post('/profile/update', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userID = req.session.user.user_id;
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



app.get('/profile/:username', async (req, res) => {
  // Profile username parameter from the URL
  const username = req.params.username;

  // The currently logged-in user (viewer)
  const viewer = req.session.user;

  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const userPosts = await db.any('SELECT * FROM posts WHERE user_id = $1', [user.user_id]);

    // Check if the logged-in user is the owner of the profile
    const isOwner = viewer && viewer.username === username;
    const isOwnerOrClient = viewer && (isOwner || viewer.isClient);

    let canConnect = false;
    let connectionExists = false;
    
    // Only clients can connect to artists
    if (
      viewer &&
      viewer.isClient &&  // Viewer is an employer
      !user.isClient && // Profile being viewed is an artist
      !isOwner // Not the owner's profile
    ) {
      canConnect = true;

      // Check if a connection already exists between the viewer (employer) and the userProfile (artist)
      const existingConnection = await db.oneOrNone('SELECT * FROM connections WHERE employer_id = $1 AND artist_id = $2', [viewer.user_id, user.user_id]);
      if (existingConnection) {
        connectionExists = true;
      }
    }

    // Fetch connections for the user profile based on whether they are an employer or artist
    let connections = [];
    if (user.isClient) {
      // If the profile is an employer, fetch all artists they are connected with
      connections = await db.any(
        'SELECT u.username, u.user_id FROM users u INNER JOIN connections c ON u.user_id = c.artist_id WHERE c.employer_id = $1',
        [user.user_id]
      );
    } else if (!user.isClient) {
      // If the profile is an artist, fetch all employers they are connected with
      connections = await db.any(
        'SELECT u.username, u.user_id FROM users u INNER JOIN connections c ON u.user_id = c.employer_id WHERE c.artist_id = $1',
        [user.user_id]
      );
    }

    // Render the profile page with user data, posts, and connections
    res.render('pages/profile', {
      user: user,
      posts: userPosts,
      isOwner,
      isOwnerOrClient,
      sessionUser: viewer,
      canConnect,
      connectionExists,
      connections, // Include connections in the response
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Database error: ' + err.message);
  }
});



// Registration
app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.post('/register', async (req, res) => {
  const { username, password, confirmPassword, isClientHidden } = req.body;
  const isClient = isClientHidden === 'true';

  if (!username || !password || !confirmPassword) {
      return res.status(400).render('pages/register', { message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
      return res.status(400).render('pages/register', { message: 'Passwords do not match' });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.none('INSERT INTO users (username, password, isClient) VALUES ($1, $2, $3)', [username, hashedPassword, isClient]);
      return res.render('pages/login', { success: 'Registration successful!' });
  } catch (err) {
      if (err.code === '23505' && err.constraint === 'users_username_key') {
        return res.render('pages/register', {
          message: 'That username is already taken.',
        });
      }

      console.error('Error inserting user:', err);
      return res.status(500).render('pages/register', { message: 'Internal server error' });
  }
});

// Login page
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
      req.session.user = {
        user_id: user.user_id,
        username: user.username,
        isClient: user.isClient,
      };
      res.redirect('/');
    } else {
      res.status(400).render('pages/login', { message: 'Wrong username or password' });
    }
  } catch (err) {
    res.status(400).render('pages/login', { message: 'Wrong username or password' });
  }
});

//Search
app.get('/search', async (req, res) => {
  const searchQuery = req.query.searchQuery || '';
  const userQuery = `SELECT username, bio FROM users WHERE LOWER(username) LIKE LOWER($1);`;
  //LOWER - converts username to all lower case
  //LIKE SQL functionality(ex): %john, john%, %john% all will return for username hjohnward

  try {
    const result = await db.any(userQuery, [`%${searchQuery}%`]);

    console.log(result);

    res.render('pages/search', {
      searchQuery: searchQuery,
      items: result,
      user: req.session.user // added this line so nav bar stays changed when users are logged in
      //array of users containing the username
      //eg - %john, john%, %john% all will return
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('database error' + err.message);
  }
});

// Messages Routes
app.get('/messages', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
    try{
        const conversations = await db.any(
            `SELECT DISTINCT u.user_id, u.username
             FROM users u
             JOIN messages m ON (u.user_id = m.sender_id OR u.user_id = m.receiver_id)
             WHERE $1 IN (m.sender_id, m.receiver_id) AND u.user_id != $1`,
            [req.session.user.user_id]
        );
        res.render('pages/messages', { user: req.session.user, conversations: conversations });
    } catch (error) {
        console.error("Error retrieving conversations:", error);
        res.status(500).send("Error retrieving conversations");
    }

});

app.post('/send-message', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Unauthorized');
    }

    const { recipientId, messageText } = req.body;
    const senderId = req.session.user.user_id;

    try {
        const recipient = await db.oneOrNone('SELECT user_id FROM users WHERE user_id = $1', [recipientId]);
        if (!recipient) {
            return res.status(400).send('Recipient not found');
        }

        sendMessage(req.session.user.username, messageText);

        await db.none(
            `INSERT INTO messages (sender_id, receiver_id, message_text, timestamp)
             VALUES ($1, $2, $3, NOW())`,
            [senderId, recipientId, messageText]
        );
        res.status(200).send('Message sent successfully');

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/get-messages', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized');
  }

  const { recipientId } = req.query;
  const senderId = req.session.user.user_id;

  try {
    const messages = await db.any(
      `SELECT message_text, timestamp, 
       CASE 
         WHEN m.sender_id = $1 THEN 'You' 
         ELSE u.username 
       END as sender
       FROM messages m
       JOIN users u ON m.sender_id = u.user_id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY timestamp ASC`,
      [senderId, recipientId]
    );
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).send("Internal server error");
  }
});


// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

// Error handling for images
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).render('error', { message: 'File upload error: ' + err.message });
  } else {
    next(err);
  }
});

// ---------------- START SERVER ----------------
module.exports = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
