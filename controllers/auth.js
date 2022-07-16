import mysql from "mysql";
import bcrypt from "bcrypt";

import { DB_CONFIG } from "../constants.js";

export const getRegister = (req, res) => {
  res.render("register");
};

export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = (req, res) => {
  const { password, email } = req.body;
  const error_html =
    "<h1>Incorrect username or password</h1><a href='/login'>Back to Login</a>";

  if (!password || !email) {
    return res.send(error_html);
  }

  const passwordQuery = `SELECT id, hashed_password FROM users WHERE email="${email}"`;
  let mysqlConnection = mysql.createConnection(DB_CONFIG);
  mysqlConnection.query(passwordQuery, (error, rows) => {
    if (error) throw error;
    if (rows.length === 0) return res.send(error_html);
    let hashed_password = rows[0]["hashed_password"];
    mysqlConnection.end();
    bcrypt.compare(password, hashed_password, (error, status) => {
      if (error) throw error;
      if (status) {
        req.session.user_id = rows[0]["id"];
        return res.redirect("/");
      }
      return res.send(error_html);
    });
  });
};

export const postRegister = async (req, res) => {
  const { password, first_name, last_name, email } = req.body;
  const error_html =
    "<h1>Missing Fields or Email was Taken</h1><a href='/register'>Back to Sign Up</a>";

  if (!password || !first_name || !last_name || !email) {
    return res.send(error_html);
  }

  const hashed_password = await bcrypt.hash(password, 5);
  const emailQuery = `SELECT * FROM users WHERE email="${email}"`;
  const registerQuery = `INSERT INTO users(first_name, last_name, email, hashed_password)
  VALUES("${first_name}", "${last_name}", "${email}", "${hashed_password}")`;

  let mysqlConnection = mysql.createConnection(DB_CONFIG);
  mysqlConnection.query(emailQuery, (error, rows) => {
    if (error) throw error;
    // If email taken...
    if (rows.length > 0) {
      mysqlConnection.end();
      return res.send(error_html);
    }
    // If email not taken, then hash password
    mysqlConnection.query(registerQuery, (error, rows) => {
      if (error) throw error;

      mysqlConnection.end();

      req.session.user_id = rows.insertId;
      return res.redirect("/");
    });
  });
};

export const logout = (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
};
