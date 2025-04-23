const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const bcrypt = require('bcryptjs');
const exphbs = require('express-handlebars');
const session = require('express-session');
const apiKey = process.env.API_KEY;
const Handlebars = require('handlebars');  //for date, is different than express

// Setup database connection using environment variables
const db = pgp({
  host: process.env.POSTGRES_HOST || 'db',
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

// Handlebars Date helper, converts GMT stuff to normal time stuff
Handlebars.registerHelper('simpleDate', function(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}`;
});


// Setup view engine
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    simpleDate: Handlebars.helpers.simpleDate,  // for date
  },
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
      const message = snapshot.val();  // for messages
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
    resave: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
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
      `SELECT p.title, p.description, p.date_created, p.image, p.tags, u.username
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       ORDER BY p.date_created DESC`
    );
    
    res.render('pages/home', { posts, user: req.session.user, sessionUser: req.session.user });
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
  const { title, description, tags } = req.body;
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const userID = req.session.user.user_id;

  try {
    const imagePath = req.file ? req.file.filename : null; // added post image path

    await db.none(
      `INSERT INTO posts (user_id, title, description, date_created, tags, image) 
       VALUES ($1, $2, $3, NOW(), $4, $5)`,
      [userID, title, description, tags, imagePath]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error submitting post:', err);
    res.status(500).send('Error submitting post.');
  }
});


// ---------------- PROFILE ROUTES  ----------------//
//view your own profile
app.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  //if not signed in

  const profileUserID = req.query.user_id ? parseInt(req.query.user_id) : (req.session.user ? req.session.user.user_id : 1);
  //converts string query to an integer

  const isOwner = req.session.user.user_id === profileUserID; //should always be true anyways
  const canConnect = false; //user cannot connect with their own profile
  const isOwnerOrClient = req.session.user && (req.session.user.user_id === profileUserID || req.session.user.isclient);
  //for contact me information

  try {
    const user = await db.one(
      'SELECT user_id, username, email, isclient, bio, website, location, profile_image FROM users WHERE user_id = $1',
      [profileUserID]);
    //returns basic user information

    const posts = await db.any(
      `SELECT title, description, date_created, tags, image
      FROM posts  
      WHERE user_id = $1 
      ORDER BY date_created DESC`,
      [profileUserID]);
    //returns user posts

    let connections = [];
    let pendingRequests = [];

    if (user.isclient) {
      //return all accepted connections for the client
      connections = await db.any(
        'SELECT u.username, u.user_id, u.profile_image FROM users u INNER JOIN connections c ON u.user_id = c.artist_id WHERE c.employer_id = $1 AND c.status = $2',
        [user.user_id, 'accepted']);

      //return all pending connection requests made by the current client
      pendingRequests = await db.any(
        'SELECT c.connection_id, u.username AS artist_username, u.profile_image FROM connections c JOIN users u ON u.user_id = c.artist_id WHERE c.employer_id = $1 AND c.status = $2',
        [user.user_id, 'pending']);

    } else {
      //if user is artist, return their accepted connections
      connections = await db.any(
        'SELECT u.username, u.user_id, u.profile_image FROM users u INNER JOIN connections c ON u.user_id = c.employer_id WHERE c.artist_id = $1 AND c.status = $2',
        [user.user_id, 'accepted']);

      pendingRequests = await db.any(
        'SELECT c.connection_id, u.username AS client_username, u.profile_image FROM connections c JOIN users u ON u.user_id = c.employer_id WHERE c.artist_id = $1 AND c.status = $2',
        [req.session.user.user_id, 'pending']);
    }

    console.log('Session User on Search Page:', req.session.user);

    res.render('pages/profile', {
      user,
      posts,                 
      connections,
      pendingRequests,
      sessionUser: req.session.user,
      isOwner,
      isOwnerOrClient,
      canConnect,
    }); 

  } catch (err) {
    console.error(err);
    res.status(500).send('ERROR: Could not get profile');
  }
});

// Update profile
//update your own profile
app.post(
  '/profile/update',
  upload.single('profileImage'),
  async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const userID = req.session.user.user_id;
    const { website, location, bio } = req.body;
    // If an image was uploaded, use its filename; otherwise, keep existing
    const profileImage = req.file ? req.file.filename : req.session.user.profile_image;
    try {
      await db.none(
        'UPDATE users SET profile_image = $1, website = $2, location = $3, bio = $4 WHERE user_id = $5',
        [profileImage, website, location, bio, userID]
      );
      // Update session so the new image shows immediately
      req.session.user.profile_image = profileImage;
      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      res.status(500).send('ERROR: Could not update profile info');
    }
  }
);

// Other profile
//view someone elses profile
app.get('/profile/:username', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const username = req.params.username;
  //profile of user viewing, retrieved from url
  const viewer = req.session.user;
  //user currently logged in

  if (viewer && viewer.username === username){
    res.redirect('/profile');
  }
  //if it is the users own profile, switch to /profile route

  try {
    const user = await db.oneOrNone(
      `SELECT user_id, username, email, isclient, bio, website, location, profile_image FROM users WHERE username = $1`, 
      [username]);

    console.log('Fetched user', user);
    //user we are trying to view

    if (!user) {
      return res.status(404).send('User not found');
    }

    const userPosts = await db.any(
      'SELECT * FROM posts WHERE user_id = $1', 
      [user.user_id]);

    // Check if the logged-in user is the owner of the profile
    const isOwner = false; //is the user the owner of this profile
    const isOwnerOrClient = viewer && (isOwner || viewer.isclient); //for contact me info
    
    //employees only clients can connect to artists
    //CONDITIONS:
      //viewer is an employer 
      //not owner's profile
      //profile being viewed is an artist
    let canConnect = false;
    let connectionExists = false;
    let isPending = false; //for button control 

    if (viewer && viewer.isclient &&  !user.isclient && !isOwner ) {
      canConnect = true;

      //check if a connection already exists between the viewer (employer) and the user(artist)
      const existingConnection = await db.oneOrNone('SELECT * FROM connections WHERE employer_id = $1 AND artist_id = $2 AND status IN ($3, $4)', 
        [viewer.user_id, user.user_id, 'pending', 'accepted']);
      if (existingConnection) {
        connectionExists = true;
        if (existingConnection.status === 'pending') {
          isPending = true;
        }
      }
    }

    let connections = []; //return connections for the user profile
    if (user.isclient) {
      //if profile is employer, return all artists they are connected with
      connections = await db.any(
        'SELECT u.username, u.user_id, u.profile_image FROM users u INNER JOIN connections c ON u.user_id = c.artist_id WHERE c.employer_id = $1 AND c.status = $2',
        [user.user_id, 'accepted']);
  
    } else if (!user.isclient) {
      //if profile is an artist, return all employers they are connected with
      connections = await db.any('SELECT u.username, u.user_id, u.profile_image FROM users u INNER JOIN connections c ON u.user_id = c.employer_id WHERE c.artist_id = $1 AND c.status = $2',
        [user.user_id, 'accepted']);
    }

    // Render the profile page with user data, posts, and connections
    res.render('pages/profile', {
      user,
      posts: userPosts,
      connections,
      sessionUser: req.session.user,
      isOwner,
      isOwnerOrClient,
      canConnect,
      connectionExists,
      isPending
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Database error: ' + err.message);
  }
});


// ---------------- CONNECTION ROUTES ----------------
//after client clicks request connection
app.post('/connect/:username', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const viewer = req.session.user;
  const artistUsername = req.params.username;

  if (!viewer || !viewer.isclient) {
    return res.status(403).send('Only clients can request connections.');
  }

  try {
    const artist = await db.one(
      'SELECT user_id FROM users WHERE username = $1 AND isclient = false', 
      [artistUsername]);
    //artist trying to connect with

    //does this exist
    const existing = await db.oneOrNone(
      'SELECT * FROM connections WHERE employer_id = $1 AND artist_id = $2',
      [viewer.user_id, artist.user_id]);

    if (existing) {
      return res.send('Connection already exists or is pending.');
    }

    await db.none(
      'INSERT INTO connections (employer_id, artist_id, status) VALUES ($1, $2, $3)',
      [viewer.user_id, artist.user_id, 'pending']);

  
    res.redirect(`/profile/${artistUsername}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not request connection');
  }
});

//if artist accepts the connection
app.post('/connection/:id/accept', async (req, res) => {
  const artistID = req.session.user?.user_id;

  try {
    await db.none(
      'UPDATE connections SET status = $1 WHERE connection_id = $2 AND artist_id = $3',
      ['accepted', req.params.id, artistID]
    );
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not accept connection');
  }
});

//if artist rejects the connection
app.post('/connection/:id/reject', async (req, res) => {
  const artistID = req.session.user?.user_id;

  try {
    await db.none(
      'UPDATE connections SET status = $1 WHERE connection_id = $2 AND artist_id = $3',
      ['rejected', req.params.id, artistID]
    );
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not reject connection');
  }
});


// ---------------- LOGIN HANDLING ----------------
// Registration
app.get('/register', (req, res) => {
  res.render('pages/register');
});

app.post('/register', async (req, res) => {
  const { username, password, confirmPassword, accountType } = req.body;
  const isClient = accountType === 'client'; 
  const defaultProfilePic = 'defaultProfilePic.png';

  if (!username || !password || !confirmPassword || !accountType) {
    return res.status(400).render('pages/register', { message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).render('pages/register', { message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.none(
      'INSERT INTO users (username, password, isclient, profile_image) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, isClient, defaultProfilePic]
    );
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
        isclient: user.isclient,
        profile_image: user.profile_image,
      };
      res.redirect('/');
    } else {
      res.status(400).render('pages/login', { message: 'Wrong username or password' });
    }
  } catch (err) {
    res.status(400).render('pages/login', { message: 'Wrong username or password' });
  }
});

// ---------------- SEARCH ROUTES ----------------
app.get('/search', async (req, res) => {
  const searchQuery = req.query.searchQuery || '';
  const searchType = req.query.searchType || 'users'; // default to 'users' if none is selected

  try {
    let result = [];

    if (searchType === 'users') {
      result = await db.any(
        `SELECT username, bio, profile_image FROM users WHERE LOWER(username) LIKE LOWER($1)`,
        [`%${searchQuery}%`]
      );
    } else if (searchType === 'titles' || searchType === 'tags') {
      let query = `
        SELECT p.title, p.description, p.date_created, p.image, p.tags, u.username
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE LOWER(${searchType === 'titles' ? 'title' : 'tags'}) LIKE LOWER($1)
      `;
      result = await db.any(query, [`%${searchQuery}%`]);
    }

    res.render('pages/search', {
      searchQuery,
      searchType,
      items: result,
      user: req.session.user,
      isUserSearch: searchType === 'users',
      isTitleSearch: searchType === 'titles',
      isTagSearch: searchType === 'tags'
    });


  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Search failed: ' + err.message);
  }
});

// ---------------- MESSAGE ROUTES ----------------
app.get('/messages', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const currentUserId = req.session.user.user_id;
  const selectedRecipientId = req.query.recipientId ? parseInt(req.query.recipientId) : null;

  try {
    const conversations = await db.any( // get data from db
      `SELECT DISTINCT u.user_id, u.username, u.profile_image
       FROM users u
       JOIN messages m ON (u.user_id = m.sender_id OR u.user_id = m.receiver_id)
       WHERE $1 IN (m.sender_id, m.receiver_id) AND u.user_id != $1`,
      [currentUserId]
    );

    let messagesWithRecipient = [];
    let selectedRecipient = null;

    if (selectedRecipientId) {  // for recipient 
      selectedRecipient = await db.oneOrNone('SELECT user_id, username FROM users WHERE user_id = $1', [selectedRecipientId]);
      if (selectedRecipient) {  // makes sure recpeeint exists
        messagesWithRecipient = await db.any(  // gets messages and replaces yout name with 'You'
          `SELECT message_text, timestamp,
           CASE
             WHEN m.sender_id = $1 THEN 'You' 
             ELSE u.username
           END as sender
           FROM messages m
           JOIN users u ON m.sender_id = u.user_id
           WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
           ORDER BY timestamp ASC`,
          [currentUserId, selectedRecipientId]
        );
      }
    }

    res.render('pages/messages', {
      user: req.session.user,
      conversations: conversations,
      selectedRecipient: selectedRecipient,
      messages: messagesWithRecipient
    });
  } catch (error) {
    console.error("Error retrieving conversations/messages:", error);
    res.status(500).send("Error retrieving conversations/messages");
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

        sendMessage(req.session.user.username, messageText); // uses Firebase to send message with the function

        await db.none( // inserts the message into function
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
    res.json(messages); // gets the messages from Firebase and puts it into json form
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
