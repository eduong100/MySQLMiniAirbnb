import mysql from "mysql";
import bcrypt from "bcrypt";

import { DB_CONFIG, MYSQL_ERROR } from "../constants.js";

export const getRegister = (req, res) => {
  if (req.session.user_id) return res.redirect("/");
  res.render("register");
};

export const getLogin = (req, res) => {
  if (req.session.user_id) return res.redirect("/");
  res.render("login");
};

export const postLogin = (req, res) => {
  const { password, email } = req.body;
  const error_html =
    "<h1>Incorrect username or password</h1><a href='/login'>Back to Login</a>";

  if (!password || !email) {
    return res.send(error_html);
  }

  const passwordQuery = `SELECT id, hashed_password FROM users WHERE email=?`; // Vulnerable
  let mysqlConnection = mysql.createPool(DB_CONFIG);
  mysqlConnection.query(passwordQuery, [email], (error, rows) => {
    if (error) return res.send(MYSQL_ERROR);
    if (rows.length === 0) return res.send(error_html);
    let hashed_password = rows[0]["hashed_password"];
    mysqlConnection.end();
    bcrypt.compare(password, hashed_password, (error, status) => {
      if (error) return res.send(MYSQL_ERROR);
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
  const emailQuery = `SELECT * FROM users WHERE email=?`; // NOT VULNERABLE
  const registerQuery = `INSERT INTO users(first_name, last_name, email, hashed_password)
  VALUES(?,?,?,?)`; // NOT VULNERABLE VALUES("${first_name}", "${last_name}", "${email}", "${hashed_password}")`;

  let mysqlConnection = mysql.createPool(DB_CONFIG);
  mysqlConnection.query(emailQuery, [email], (error, rows) => {
    if (error) return res.send(MYSQL_ERROR);
    // If email taken...
    if (rows.length > 0) {
      mysqlConnection.end();
      return res.send(error_html);
    }
    // If email not taken, then hash password
    mysqlConnection.query(
      registerQuery,
      [first_name, last_name, email, hashed_password],
      (error, rows) => {
        if (error) return res.send(MYSQL_ERROR);

        mysqlConnection.end();

        req.session.user_id = rows.insertId;
        return res.redirect("/");
      }
    );
  });
};

export const logout = (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
};
