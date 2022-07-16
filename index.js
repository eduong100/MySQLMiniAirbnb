import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import path from "path";
import session from "express-session";

import {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout,
} from "./controllers/auth.js";
import { getCreateRoom } from "./controllers/rooms.js";
import {
  DB_CONFIG,
  PORT,
  __filename,
  __dirname,
  SECRET,
  MAX_AGE,
} from "./constants.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: MAX_AGE,
    },
  })
);

// ROUTES

app.get("/register", getRegister);
app.post("/register", postRegister);

app.get("/login", getLogin);
app.post("/login", postLogin);
app.post("/logout", logout);

app.get("/createRoom", getCreateRoom);

app.get("/", (req, res) => {
  let user_id = req.session.user_id;
  if (!user_id) {
    return res.render("home", { rows: null, isLoggedIn: false });
  }
  let mysqlConnection = mysql.createConnection(DB_CONFIG);
  mysqlConnection.query(
    `SELECT * FROM users WHERE id="${user_id}"`,
    (error, rows) => {
      if (error) throw error;

      if (!error) {
        console.log(rows);
        mysqlConnection.end();
        res.render("home", { rows, isLoggedIn: true });
      }
    }
  );
});

// ROUTES

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
