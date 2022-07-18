-- @BLOCK
SHOW SESSION VARIABLES LIKE '%timeout';
-- @BLOCK
SELECT id
FROM users
WHERE id = 44
UNION ALL
SELECT id
FROM rooms
WHERE id = 64;
-- @BLOCK
SELECT u.id
FROM users u
    INNER JOIN rooms r ON owner_id = u.id;