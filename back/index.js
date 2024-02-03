import "dotenv/config";
import express from "express";
import cors from "cors";
import imagesRouter from "./routes/images.js";

const app = express();
const port = 3333;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use("/images", imagesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
