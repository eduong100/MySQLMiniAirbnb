CREATE TABLE users(
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email VARCHAR(60) NOT NULL,
    hashed_password CHAR(60) NOT NULL,
    PRIMARY KEY (id)
);
-- @BLOCK
DESCRIBE users;
-- @BLOCK
INSERT INTO users(first_name, last_name, email, hashed_password)
VALUES("ETHAN", "DUONG", "etd@gmail.com", "12345");
-- @BLOCK
SELECT *
FROM users;
-- @BLOCK
DELETE FROM users
WHERE first_name LIKE "1%";
-- @BLOCK
ALTER TABLE users
MODIFY id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT;