import pool from "../db/pool.js";

export const getImages = async (req, res) => {
  try {
    const query = "SELECT * FROM images";
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
    console.log(`GET /images: ${rows.length}`);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postImage = async (req, res) => {
  const { filename } = req.file;
  const { pos, wall_id } = req.body;
  console.log(filename, Number(pos));
  try {
    const query = `INSERT INTO images (wall_id, pos, filename) VALUES ($1, $2, $3) RETURNING *`;
    const values = [wall_id, Number(pos), filename];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
    console.log(rows[0]);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const getCount = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) FROM images");
    res.json(Number(rows[0].count));
    console.log(`GET /images/count: ${Number(rows[0].count)}`);
  } catch (error) {
    res.sendStatus(500);
  }
};

// CREATE TABLE Walls (
//     id SERIAL PRIMARY KEY,
//     creation_time TIMESTAMP,
//     completion_time TIMESTAMP
// );

// CREATE TABLE Images (
//     id SERIAL PRIMARY KEY,
//     wall_id INT,
//     position INT,
//     path TEXT,
//     upload_time TIMESTAMP,
//     FOREIGN KEY (wall_id) REFERENCES Walls(id)
// );
