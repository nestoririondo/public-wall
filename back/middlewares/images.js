import pool from "../db/pool.js";

export const checkIfPositionTaken = async (req, res, next) => {
  const { pos, wall_id } = req.body;
  try {
    const query = `SELECT * FROM images WHERE pos = $1`;
    const values = [Number(pos)];
    const { rows } = await pool.query(query, values);
    console.log(rows.length);
    if (rows.length) {
      res.status(409).json({ message: "Position already taken." });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
