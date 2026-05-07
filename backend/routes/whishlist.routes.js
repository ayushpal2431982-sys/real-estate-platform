import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addWhishlist, getWhishlist, removeWhishlist } from "../controllers/wishlist.controller.js";



const whishlistRouter = express.Router();

whishlistRouter.post("/:propertyId", protect, addWhishlist);
whishlistRouter.get("/", protect, getWhishlist);
whishlistRouter.delete("/:propertyId", protect, removeWhishlist);

export default whishlistRouter;