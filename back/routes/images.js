import express from "express";
import {
  getImages,
  postImage,
  getCount,
  checkWallAndCreateNew,
} from "../controllers/images.js";
import { checkIfPositionTaken } from "../middlewares/images.js";
import { upload } from "../utils/multer.js";

const imagesRouter = express.Router();

imagesRouter.get("/", getImages);
imagesRouter.post(
  "/",
  upload.single("image"),
  checkIfPositionTaken,
  postImage,
  checkWallAndCreateNew
);
imagesRouter.get("/count", getCount);

export default imagesRouter;
