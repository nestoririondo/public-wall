import pool from "../db/pool.js";

export const getImages = async (req, res) => {
  try {
    // Get images from latest wall
    const { rows } = await pool.query(
      "SELECT * FROM images WHERE wall_id = (SELECT id FROM walls ORDER BY id DESC LIMIT 1)"
    );
    res.status(200).json(rows);
    console.log(`GET /images: ${rows.length}`);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postImage = async (req, res, next) => {
  const { filename } = req.file;
  const { pos, wall_id } = req.body;
  console.log(filename, pos, wall_id);
  try {
    const query = `INSERT INTO images (wall_id, pos, filename) VALUES ($1, $2, $3) RETURNING *`;
    const values = [Number(wall_id), Number(pos), filename];
    const { rows } = await pool.query(query, values);
    res.locals.image = rows[0];
    res.locals.wall_id = Number(wall_id);
    console.log(rows[0]);
    next();
  } catch (error) {
    res.sendStatus(500);
  }
};

export const checkWallAndCreateNew = async (req, res) => {
  const { wall_id } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM images WHERE wall_id = $1",
      [wall_id]
    );
    const count = Number(rows[0].count);
    if (count >= 25) {
      // If the wall is full, update completion time and create a new wall
      await pool.query(
        "UPDATE walls SET completion_time = NOW() WHERE id = $1",
        [wall_id]
      );
      await pool.query("INSERT INTO walls (creation_time) VALUES (NOW())");
      // Get the id of the new wall
      const { rows } = await pool.query(
        "SELECT id FROM walls ORDER BY id DESC LIMIT 1"
      );
      // Save the id of the new wall in res.locals
      res.locals.wall_id = Number(rows[0].id);
      console.log(`New wall created: ${rows[0].id}`);
    }
    res.status(201).json(res.locals);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const getCount = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM images WHERE wall_id = $1",
      [req.query.wall_id]
    );
    res.json(Number(rows[0].count));
    console.log(`GET /images/count: ${Number(rows[0].count)}`);
  } catch (error) {
    res.sendStatus(500);
  }
};

// CREATE TABLE Walls (
//   id SERIAL PRIMARY KEY,
//   creation_time TIMESTAMP,
//   completion_time TIMESTAMP
// );

// CREATE TABLE Images (
//   id SERIAL PRIMARY KEY,
//   wall_id INT,
//   pos INT,
//   filename TEXT,
//   upload_time TIMESTAMP,
//   FOREIGN KEY (wall_id) REFERENCES Walls(id)
// );
