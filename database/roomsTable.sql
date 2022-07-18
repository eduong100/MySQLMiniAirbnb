CREATE TABLE rooms(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    total_occupancy INT NOT NULL,
    total_beds INT NOT NULL,
    total_bathrooms INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    owner_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (id)
);
-- @BLOCK
DESCRIBE rooms;
-- @BLOCK
SELECT *
FROM rooms;
-- @BLOCK
DROP TABLE rooms;
-- @BLOCK
DELETE FROM rooms
WHERE id = 64;