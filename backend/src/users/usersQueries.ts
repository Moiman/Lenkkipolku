const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "username" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;

const findAllUsers = "SELECT * FROM users ORDER BY id";

const findOneUser = "SELECT * FROM users WHERE id = $1";

const findUserWithUsername = "SELECT * FROM users WHERE username = $1";

const insertUser = "INSERT INTO users ( username, password) VALUES( $1, $2) RETURNING id;";

const updateUser = "UPDATE users SET username = $2, password = $3, updated_at = CURRENT_TIMESTAMP() WHERE id = $1";

const deleteUserById = "DELETE FROM users WHERE id = $1";

export { createUsersTableQuery, findAllUsers, findOneUser, findUserWithUsername, insertUser, updateUser, deleteUserById };
