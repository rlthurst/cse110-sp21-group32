const express = require("express");
const cors = require("cors");
const pg = require('pg');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const db = require('./db');
var flash = require('connect-flash');
var passport = require("passport");
var crypto = require("crypto");
var LocalStrategy = require("passport-local").Strategy;
var path = require('path');
//var router = require('./router')

const app = express();

var corsOptions = {
  //origin: "https://pageus.site/"
};

app.use(express.static(path.resolve("../public")));
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//app.use('/', router);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(
  session({
    secret: "shh its secret",
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
      pool: db.pool,
    }),
  })
);
app.use(flash());
app.set('views', '/var/www/pageus.site/public_html')

// ---
// START PASSPORT

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

passport.use(new LocalStrategy(function (username, password, cb) {
  db.query('SELECT id, username, hash, salt FROM users WHERE username=$1', [username], (err, result) => {
    if (err) {
      //winston.error('Error when selecting user on login', err)
      console.log(err);
      return cb(err)
    }

    if (result.rows.length > 0) {
      const first = result.rows[0]
      const isValid = validPassword(password, first.hash, first.salt);
      if (isValid) {
        let user = {
          'id': first.id,
          'username': first.username
        }
        cb(null, user);
      } else {
        cb(null, false);
      }
    } else {
      cb(null, false);
    }
  })
}));

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.query('SELECT id, username FROM users WHERE id = $1', [parseInt(id, 10)], (err, results) => {
    if (err) {
      //winston.error('Error when selecting user on session deserialize', err)
      return cb(err)
    }
    if (results.rows[0]) {
      let user = {
        'id': results.rows[0].id,
        'username': results.rows[0].username
      }
      cb(null, user);
    }
    else{
      cb(null, null);
    }
  })
});

app.use(passport.initialize());
app.use(passport.session());

// ---
// Begin routes
app.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    res.sendFile("/var/www/pageus.site/public_html/sources/index.html");
  }
});

app.get("/login", (req, res) => {
  const errors = req.flash().error || [];
  res.render('login/index.ejs', { errors });
});

app.get("/signup", (req, res) => {
  const errors = req.flash().error || [];
  res.render('signup/index.ejs', { errors });
});

// Visiting this route logs the user out
app.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("error", "Successfully logged out")
  res.redirect("/login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: 'Invalid username or password',
    failureRedirect: "/login",
    successRedirect: "/",
  }),
  (err, req, res, next) => {
    if (err) next(err);
  }
);

app.post("/signup", async (req, res) => {
  let { username, password } = req.body;

  let errors = [];

  if (!username || !password) {
    errors.push({ message: "Please enter all fields" });
    req.flash("error", "Please enter all fields");
  }

  else if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
    req.flash("error", "Password must be at least 6 characters long");
  }

  //if (password !== password2) {
  //  errors.push({ message: "Passwords do not match" });
  //}

  if (errors.length > 0) {
    res.redirect("/signup");
  } else {
    const saltHash = genPassword(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // Validation passed
    db.query(
      `SELECT * FROM users
        WHERE username = $1`,
      [username],
      (err, results) => {
        if (err) {
          console.log(err);
        }

        if (results.rows.length > 0) {
          req.flash("error", "Username taken");
          res.redirect("/signup")
        } else {
          db.query(
            `INSERT INTO users (username, salt, hash)
                VALUES ($1, $2, $3)
                RETURNING id`,
            [username, salt, hash],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("error", "You are now registered. Please log in");
              res.redirect("/login");
            }
          );
        }
      }
    );
  }
});

app.get("/api/", (req, res) => {
  console.log(req.session.passport.user);
  db.query(
    `SELECT bulletarr, categoryarr, datearr FROM users WHERE id = $1;`,
    [req.session.passport.user],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      console.log(results.rows[0]);
      if (results.rows[0].bulletarr == null) {
        results.rows[0].bulletarr = [];
      }
      if (results.rows[0].categoryarr == null) {
        results.rows[0].categoryarr = [];
      }
      if (results.rows[0].datearr == null) {
        results.rows[0].datearr = [];
      }
      res.json(results.rows[0]);
    }
  )
})

app.post("/api/bullet", async (req, res) => {
  console.log(req.body);
  db.query(
    `UPDATE users SET bulletarr = $2 WHERE id = $1;`,
    [req.session.passport.user, req.body],
    (err, results) => {
      if (err) {
        console.log(err);
      }
    }
  )
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});