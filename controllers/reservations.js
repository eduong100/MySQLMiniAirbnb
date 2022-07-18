import { MYSQL_ERROR } from "../constants.js";

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
  let { id } = req.params;
  if (!date) return res.redirect(`/rooms/${id}/createReservation`);
  res.send(MYSQL_ERROR);
};
