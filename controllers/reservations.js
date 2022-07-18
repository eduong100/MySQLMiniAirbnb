import mysql from "mysql";
import { MYSQL_ERROR, DB_CONFIG } from "../constants.js";

export const getCreateReservation = (req, res) => {
  let user_id = req.session.user_id;
  if (!user_id) {
    return res.redirect("/");
  }
  let { id } = req.params;
  let currentDate = new Date();
  let [day, month, year] = [
    currentDate.getDate(),
    currentDate.getMonth() + 1,
    currentDate.getFullYear(),
  ];
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;
  currentDate = `${year}-${month}-${day}`;
  let maxDate = `${year + 4}-12-31`;
  return res.render("createReservation", { id, currentDate, maxDate });
};

export const postCreateReservation = (req, res) => {
  let { date } = req.body;
  let room_id = req.params.id;
  let { user_id } = req.session;
  if (!user_id) return res.redirect("/");
  if (!date) return res.redirect(`/rooms/${room_id}/createReservation`);

  let reservationQuery =
    "INSERT INTO reservations(date,user_id,room_id) VALUES(?,?,?)";
  // Check existence of room (SHOULD GET EXACTLY ONE ROW)
  let existenceQuery = `SELECT id FROM rooms WHERE id = ?`;

  let mysqlConnection = mysql.createPool(DB_CONFIG);
  mysqlConnection.query(existenceQuery, [room_id], (error, rows) => {
    if (error) return res.status(404).send(MYSQL_ERROR);

    if (rows.length !== 1)
      return res.send(
        "<h1>Cannot create reservation for room that doesn't exist</h1>"
      );
    mysqlConnection.query(
      reservationQuery,
      [date, user_id, room_id],
      (error, rows) => {
        if (error) return res.status(404).send(MYSQL_ERROR);

        mysqlConnection.end();
        res.redirect("/");
      }
    );
  });
};

export const getReservations = (req, res) => {
  let user_id = req.session.user_id;
  if (!user_id) {
    return res.redirect("/");
  }
  let { id } = req.params;
  let reservationsQuery = `SELECT room.name room_name, res.date date, room.id room_id 
  FROM reservations res
  INNER JOIN rooms room ON room.id = res.room_id
  ORDER BY res.date ASC`;
  let mysqlConnection = mysql.createPool(DB_CONFIG);
  mysqlConnection.query(reservationsQuery, (error, rows) => {
    if (error) return res.status(404).send(MYSQL_ERROR);
    mysqlConnection.end();
    res.render("reservations", { reservations: rows });
  });
};
