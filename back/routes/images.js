import express from "express";
import { getImages, postImage, getCount } from "../controllers/images.js";
import { upload } from "../utils/multer.js";

const imagesRouter = express.Router();

imagesRouter.get("/", getImages);
imagesRouter.post("/", upload.single("image"), postImage);
imagesRouter.get("/count", getCount);

export default imagesRouter;
