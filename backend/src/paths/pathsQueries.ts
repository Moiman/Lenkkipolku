const createPathsTableQuery = `
CREATE TABLE IF NOT EXISTS "paths" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "path" JSONB NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;

const findAllPaths = "SELECT * FROM paths WHERE user_id = $1 ORDER BY id;";

const findPath = "SELECT * FROM paths WHERE id = $1 AND user_id = $2;";

const insertPath = "INSERT INTO paths (user_id, title, path) VALUES ($1, $2, $3) RETURNING *;";

const updatePath = `
UPDATE paths
SET title = $3,
    path = $4,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND user_id = $2
RETURNING *;`;

const deletePath = "DELETE FROM paths WHERE id = $1 AND user_id = $2 RETURNING *;";

export {
  createPathsTableQuery,
  findAllPaths,
  findPath,
  insertPath,
  updatePath,
  deletePath,
};
