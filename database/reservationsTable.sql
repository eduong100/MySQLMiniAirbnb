CREATE TABLE reservations(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    date DATE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    room_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);
-- @BLOCK
-- Originally forgot to add the foreign key
ALTER TABLE reservations
ADD FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE;
-- @BLOCK
DESCRIBE reservations;
-- @BLOCK
SELECT *
FROM reservations;
-- @BLOCK
-- GET ALL RESERVATIONS WITH RESPECTIVE ROOMS AND RESERVERS
SELECT date date_reserved,
    r.name lodging,
    u.first_name reserver
FROM reservations res
    INNER JOIN rooms r ON res.room_id = r.id
    INNER JOIN users u ON u.id = res.user_id;