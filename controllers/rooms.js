import mysql from "mysql";

export const getCreateRoom = (req, res) => {
  if (!req.session.user_id) return res.redirect("/");
  res.send("IM A SECRET");
};
